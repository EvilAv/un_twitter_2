import React, { useEffect } from "react";
import { PostList } from "../../components/post-list";
import * as tf from '@tensorflow/tfjs';

// import model from './model.json'

const a = async () => {
    const t = await tf.loadLayersModel('http://localhost:5000/model', {
        weightPathPrefix: 'http://localhost:5000/binary/'
    })
    // console.log(t);
    const tensor = tf.tensor2d([7.0,3.2,4.7,1.4], [1, 4]);
    const prediction = t.predict(tensor) as tf.Tensor2D;
    prediction.reshape([1, 3]);
    console.log(prediction.argMax().print())
    console.log(prediction.print())
    console.log(prediction.reshape([3, 1]).argMax().arraySync()[0])
    console.log(tensor.print())

    console.log(tensor.shape, prediction.shape)
}

export const Home = () => {
    // looks like we need to add a binary file too
    // console.log(model);
    useEffect(() => {
        a();
    }, []);

    return (
        <>
            <PostList />
        </>
    );
};
