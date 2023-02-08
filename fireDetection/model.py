# %%

import tensorflow as tf
 
# %%
batch_size = 32
img_height = 180
img_width = 180
seed = 1086
data_dir_train = "/kaggle/input/urecamain/Train"
data_dir_vali = "/kaggle/input/urecamain/Vali"
data_dir_test = "/kaggle/input/urecamain/Test"
 
# %%
train_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir_train,
  seed=seed,
  label_mode="binary",
  image_size=(img_height, img_width),
  batch_size=batch_size
)
 
val_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir_vali,
  seed=seed,
  label_mode="binary",
  image_size=(img_height, img_width),
  batch_size=batch_size
)
 
test_ds = tf.keras.utils.image_dataset_from_directory(
  data_dir_test,
  seed=seed,
  label_mode="binary",
  image_size=(img_height, img_width),
  batch_size=batch_size
)
 
 
# %%
AUTOTUNE = tf.data.AUTOTUNE
 
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
test_ds = test_ds.cache().prefetch(buffer_size=AUTOTUNE)
 
# %% [markdown]
# 
 
# %%
 
 
# %%
data_augmentation = tf.keras.Sequential([
  tf.keras.layers.RandomFlip('horizontal'),
  tf.keras.layers.RandomRotation(0.2),
])
 
 
# %%
rescale = tf.keras.layers.Rescaling(1./127.5, offset=-1)
preprocess = tf.keras.applications.efficientnet.preprocess_input
 
# %%
IMG_SHAPE = (180,180) + (3,)
base_model = tf.keras.applications.EfficientNetB7(
    include_top=False,
    weights='imagenet',
    input_shape=IMG_SHAPE
)
 
 
# %%
base_model.trainable = False
 
 
# %%
base_model.output
 
# %%
global_average_layer = tf.keras.layers.Flatten()
 
prediction_layer = tf.keras.layers.Dense(1,activation="sigmoid")
 
 
# %%
inputs = tf.keras.Input(shape=(180, 180, 3))
x = data_augmentation(inputs)
x = preprocess(x)
x = base_model(x, training=False)
x = tf.keras.layers.Conv2D(32,1)(x)
x = global_average_layer(x)
x = tf.keras.layers.Dense(256)(x)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = tf.keras.layers.Dense(1,activation="sigmoid")(x)
model = tf.keras.Model(inputs, outputs)
 
# %%
model.summary()
 
# %%
model.compile(optimizer=tf.keras.optimizers.Adam(),
              loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              metrics=['accuracy'])
 
 
# %%
loss0, accuracy0 = model.evaluate(test_ds)
 
 
# %%
history = model.fit(train_ds,
                    epochs=5,
                    validation_data=val_ds)
 
 
# %%
loss0, accuracy0 = model.evaluate(test_ds)
 
 
# %%
model.save("FireDetector")
 