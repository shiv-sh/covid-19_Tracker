import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBox.css';

function InfoBox({isRed, active, title, cases, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent>
                <Typography className="infoBox__title" text="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>Today:{cases}</h2>
                <Typography className="infoBox__total">
                    Total:{total}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
