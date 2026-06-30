import React from "react";
import "./QuizScheduler.css";

import ConfigureScheduler from "./ConfigureScheduler/ConfigureScheduler";

export default function QuizScheduler({ loggedInUser }) {

    return (

        <div className="scheduler">

            <ConfigureScheduler
                loggedInUser={loggedInUser}
            />

        </div>

    );

}