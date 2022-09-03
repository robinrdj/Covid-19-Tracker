import React from 'react';
import "./Infobox.css";
import { Card, Typography } from '@mui/material';
import {CardContent} from '@mui/material';

function Infobox({onClick,title, cases, total}) {
  return (
   <Card onClick ={onClick} className='infobox'>
    <CardContent>
        <Typography className="infobox__title" color="textSecondary">
             {title}
        </Typography>
        <h2 className='infobox__cases'>{cases}</h2>
        <Typography className="infobox__total" color="textSecondary">
          {total} Total
        </Typography>
    </CardContent>
   </Card>
  )
}

export default Infobox;