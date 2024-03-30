import React, {FC} from "react";

type DashboardProps = {
    params: any
}

export const Dashboard:FC<DashboardProps> = function () {


    return (
        <section className={`dashboard`}>
            Dashboard
        </section>
    )
}