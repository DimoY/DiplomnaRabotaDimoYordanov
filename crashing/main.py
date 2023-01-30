import tensorflow as tf

model = tf.keras.models.load_model("modelSave92.43%")

model = tf.keras.Sequential([
    tf.keras.layers.Reshape((128,128,3)),
    model
])

model.build(input_shape=(None,None,3))

model.save("3")
