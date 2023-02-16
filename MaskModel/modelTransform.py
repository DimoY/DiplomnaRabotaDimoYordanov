import tensorflow as tf

model = tf.keras.models.load_model("MaskModel-0.91%")

model = tf.keras.Sequential([
    tf.keras.layers.Reshape((64,64,3)),
    model
])

model.build(input_shape=(None,None,3))

model.save("models/1")
