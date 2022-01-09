import React from "react"
const Header = () => {
    return (
        <div>
            <div className="jumbotron jumbotron-fluid ">
                <div className="text-center">
                    <h1>MTX HACKOLYMPICS</h1>
                    <h4>Scoring Event Detector</h4>
                </div>
            </div>
            <div className="ml-5 col-3 mb-5">
                <ul className="list-group">
                    <li className="list-group-item active">Team Members:</li>
                    <li className="list-group-item">Jeshlin Donna Jeba</li>
                    <li className="list-group-item">Abhipraay Nevatia</li>
                    <li className="list-group-item">Gautam Vaja</li>
                    <li className="list-group-item">Jayanth K</li>
                </ul>
            </div>
        </div>
    )
}

export default Header