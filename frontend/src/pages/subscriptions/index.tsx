import { useUnit } from "effector-react";
import React, { useEffect } from "react";
import { $subscriptions, subscriptionsLoaded } from "../../features/recomendations/state";
import { UserList } from "../../components/user-list";

export const Subscriptions = () => {
    const loadSubscriptions = useUnit(subscriptionsLoaded);
    const users = useUnit($subscriptions);

    useEffect(() => {
        loadSubscriptions();
    }, [])

    return (
        <>
            <UserList users={users} />
        </>
    );
};
