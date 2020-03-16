import React from 'react';

function Evolution(props) {
    return (
        <tr>
            <td>{props.date}</td>
            <td>{props.number}</td>
            <td>{props.deaths}</td>
        </tr>
    );
}

export default Evolution;
