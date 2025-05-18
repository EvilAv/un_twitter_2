import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as tf from "@tensorflow/tfjs";

type FormData = {
    field1?: number;
    field2?: number;
    field3?: number;
    field4?: number;
};

export const NetTest = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const onSubmit: SubmitHandler<FormData> = useCallback(
        ({ field1 = 0, field2 = 0, field3 = 0, field4 = 0 }) => {
            // console.log(data);
            console.log(field1)
            const tensor = tf.tensor2d(
                [field1, field2, field3, field4],
                [1, 4]
            );
            if (model.current){
                const predictionTensor = model.current.predict(tensor) as tf.Tensor2D;
                const prediction = predictionTensor.reshape([3, 1]).argMax().arraySync() as number[];
                if (prediction[0] === 0){
                    setAnswer('Iris-setosa')
                } else if (prediction[0] === 1){
                    setAnswer('Iris-versicolor')
                } else {
                    setAnswer('Iris-virginica')
                }
            }
        },
        []
    );

    const loadModel = useCallback(async () => {
        const _model = await tf.loadLayersModel("http://localhost:5000/model", {
            weightPathPrefix: "http://localhost:5000/binary/",
        });
        model.current = _model;
        console.log("message");
    }, []);

    const model = useRef<tf.LayersModel | null>(null);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        loadModel();
    }, []);

    return (
        <div>
            <h1>Test neural net</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <input type="number" step={0.1} {...register("field1", {valueAsNumber: true})} />
                <input type="number" step={0.1} {...register("field2", {valueAsNumber: true})} />
                <input type="number" step={0.1} {...register("field3", {valueAsNumber: true})} />
                <input type="number" step={0.1} {...register("field4", {valueAsNumber: true})} />
                <input type="submit" value="Predict" />
                <div style={{ backgroundColor: "yellow" }}>{answer}</div>
            </form>
        </div>
    );
};
