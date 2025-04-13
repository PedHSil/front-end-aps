import React from "react";
import './dashboard.css';

function Dashboard(){
    return(
        <div className="container">
            <div className="heading">Dashboard</div>
            <div className="content">
                <h1>Bem-vindo ao Dashboard!</h1>
                <p>Esta é a página inicial do seu aplicativo.</p>
            </div>
        </div>
    );
}

export default Dashboard;