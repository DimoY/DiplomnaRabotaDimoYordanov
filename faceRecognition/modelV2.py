# %%
import tensorflow as tf
from collections import defaultdict
from random import randint
 
# %%
information = defaultdict(list)
 
with open("123.txt") as f:
    file = f.readlines()
 
for i in file:
    img_name,face_id = i.split(" ")
    face_id = int(face_id)
    img_name = "img_align_celeba/"+img_name
    information[face_id].append(img_name)
 
# %%
def randomly_pick(list,excluding=-1):
    val = len(list)-1
    k = randint(0,val)
    while k == excluding:
        k = randint(0,val)
    return list[k],k
 
# %%
keys = list(information.keys())
def getImages():
    rng_max = len(keys)-1
    actual = keys[randint(0,rng_max)]
    negative = keys[randint(0,rng_max)]
 
    value = None
    anchor = None
    oposite = None
 
    if len(information[actual])==1:
        error = True
    else:
        error  = False
        value,excl = randomly_pick(information[actual])
        anchor,_ = randomly_pick(information[actual],excl)
        oposite,_ = randomly_pick(information[negative])
        
    return error,value,anchor,oposite
 
# %%
from IPython.display import display,Image
 
def display_img(ima):
    display(Image(ima, format='jpeg'))
 
_,value,anchor,oposite = getImages()
 
display_img(value)
display_img(anchor)
display_img(oposite)
 
# %%
 
 
def createDataset(amount_of_images):
    dataset = []
    used = set()
 
    for _ in range(amount_of_images):
        err,value,anchor,oposite = getImages()
        while value in used or err==True:
            err,value,anchor,oposite = getImages()
        used.add(value)
        dataset.append((value,anchor,oposite))
    
    return dataset
 
 
# %%
dataset = createDataset(200000)
 
# %%
target_shape = (112,112)
 
 
 
def preprocess_image(filename):
 
    image_string = tf.io.read_file(filename)
    image = tf.image.decode_jpeg(image_string, channels=3)
    image = tf.image.convert_image_dtype(image, tf.float32) / 255.0
    image = tf.image.resize(image, target_shape)
    return image
 
 
def preprocess_triplets(images):
 
    return (
        preprocess_image(images[0]),
        preprocess_image(images[1]),
        preprocess_image(images[2]),
    )
 
 
# %%
dataset = tf.data.Dataset.from_tensor_slices(dataset)
 
# %%
dataset = dataset.map(preprocess_triplets)
 
# %%
image_count = len(dataset)
 
# %%
image_count/1800
 
# %%
# Let's now split our dataset in train and validation.
train_dataset = dataset.take(round(image_count * 0.8))
val_dataset = dataset.skip(round(image_count * 0.8))
 
train_dataset = train_dataset.batch(1800, drop_remainder=False)
train_dataset = train_dataset.prefetch(8)
 
val_dataset = val_dataset.batch(1800, drop_remainder=False)
val_dataset = val_dataset.prefetch(8)
 
# %%
 
def createModel():
    inputer = tf.keras.layers.Input((112,112,3))
 
    conv2D_1 = tf.keras.layers.Conv2D(64,7,strides=2)(inputer)
    maxpool2D_1 = tf.keras.layers.MaxPool2D(3,strides=2)(conv2D_1)
    normalization_1 = tf.keras.layers.Normalization()(maxpool2D_1)
 
    conv2D_2 = tf.keras.layers.Conv2D(128,1)(normalization_1)
    conv2D_3 = tf.keras.layers.Conv2D(128,3)(conv2D_2)
    normalization_2 = tf.keras.layers.Normalization()(conv2D_3)
    maxpool2D_2 = tf.keras.layers.MaxPool2D(3,strides=2)(normalization_2)
 
    flt = tf.keras.layers.Flatten()(maxpool2D_2)
 
    encoder1 = tf.keras.layers.Dense(1024)(flt)
    encoder2 = tf.keras.layers.Dense(256)(encoder1)
 
    output = encoder2
 
    return tf.keras.Model(inputer, output, name="Embedding")
 
Encoder = createModel()
 
# %%
import numpy as np
res = tf.constant([np.zeros((112,112,3))])
Encoder.call(res).shape
 
# %%
class DistanceLayer(tf.keras.layers.Layer):
 
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
 
    def call(self, anchor, positive, negative):
        ap_distance = tf.reduce_sum(tf.square(anchor - positive), -1)
        an_distance = tf.reduce_sum(tf.square(anchor - negative), -1)
        return (ap_distance, an_distance)
 
 
anchor_input = tf.keras.layers.Input(name="anchor", shape=target_shape + (3,))
positive_input = tf.keras.layers.Input(name="positive", shape=target_shape + (3,))
negative_input = tf.keras.layers.Input(name="negative", shape=target_shape + (3,))
 
distances = DistanceLayer()(
    Encoder(anchor_input),
    Encoder(positive_input),
    Encoder(negative_input),
)
 
siamese_network = tf.keras.Model(
    inputs=[anchor_input, positive_input, negative_input], outputs=distances
)
 
 
# %%
class SiameseModel(tf.keras.Model):

    def __init__(self, siamese_network, margin=0.5):
        super().__init__()
        self.siamese_network = siamese_network
        self.margin = margin
        self.loss_tracker = tf.keras.metrics.Mean(name="loss")
 
    def call(self, inputs):
        return self.siamese_network(inputs)
 
    def train_step(self, data):
        with tf.GradientTape() as tape:
            loss = self._compute_loss(data)
 
        gradients = tape.gradient(loss, self.siamese_network.trainable_weights)
 
        self.optimizer.apply_gradients(
            zip(gradients, self.siamese_network.trainable_weights)
        )
 
        self.loss_tracker.update_state(loss)
        return {"loss": self.loss_tracker.result()}
 
    def test_step(self, data):
        loss = self._compute_loss(data)
 
        self.loss_tracker.update_state(loss)
        return {"loss": self.loss_tracker.result()}
 
    def _compute_loss(self, data):
 
        ap_distance, an_distance = self.siamese_network(data)

        loss = ap_distance - an_distance
        loss = tf.maximum(loss + self.margin, 0.0)
        return loss
 
    @property
    def metrics(self):
        # We need to list our metrics here so the `reset_states()` can be
        # called automatically.
        return [self.loss_tracker]
 
 
# %%
siamese_model = SiameseModel(siamese_network)
siamese_model.compile(optimizer=tf.keras.optimizers.Adam())
siamese_model.fit(train_dataset, epochs=5, validation_data=val_dataset)
 
 
# %%
Encoder.save("FaceRecognition-87%")
 