import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as tf from "@tensorflow/tfjs";
import { useUnit } from "effector-react";
import { $testModel, $testWord2vecModel, testModelRequested, testWord2vecModelRequested } from "../../features/nets/state";

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

    const loadModel = useUnit(testModelRequested);
    const model = useUnit($testModel);

    const loadModel2 = useUnit(testWord2vecModelRequested);
    const model2 = useUnit($testWord2vecModel);

    console.log(model2)

    useEffect(() => {
        if (model2){
            const vocab = JSON.parse('{"say": 0, "woof": 1, "dog": 2, "meow": 3, "cat": 4}')

            const tensor = tf.tensor1d([vocab['dog']]);
            const result = model2.predict(tensor) as tf.Tensor3D;
            const arr = result.arraySync() as number[][][]
            console.log(arr[0][0])
        }
    }, [model2])

    const [answer, setAnswer] = useState("");
    const onSubmit: SubmitHandler<FormData> = useCallback(
        ({ field1 = 0, field2 = 0, field3 = 0, field4 = 0 }) => {
            const tensor = tf.tensor2d(
                [field1, field2, field3, field4],
                [1, 4]
            );
            if (model) {
                const predictionTensor = model.predict(tensor) as tf.Tensor2D;
                const prediction = predictionTensor
                    .reshape([3, 1])
                    .argMax()
                    .arraySync() as number[];
                if (prediction[0] === 0) {
                    setAnswer("Iris-setosa");
                } else if (prediction[0] === 1) {
                    setAnswer("Iris-versicolor");
                } else {
                    setAnswer("Iris-virginica");
                }
            }
        },
        [model]
    );

    useEffect(() => {
        loadModel();
        loadModel2();
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
                <input
                    type="number"
                    step={0.1}
                    {...register("field1", { valueAsNumber: true })}
                />
                <input
                    type="number"
                    step={0.1}
                    {...register("field2", { valueAsNumber: true })}
                />
                <input
                    type="number"
                    step={0.1}
                    {...register("field3", { valueAsNumber: true })}
                />
                <input
                    type="number"
                    step={0.1}
                    {...register("field4", { valueAsNumber: true })}
                />
                <input type="submit" value="Predict" />
                <div style={{ backgroundColor: "yellow" }}>{answer}</div>
            </form>
        </div>
    );
};
