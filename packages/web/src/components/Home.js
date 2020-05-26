import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import { useHistory, useLocation } from 'react-router-dom'

import one from '../public/1.jpg'
import two from '../public/2.jpg'
import three from '../public/3.jpg'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import CenteredBox from './CenteredBox'


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  cardHeight: {
    height: 300
  }
})

function MediaCard(props) {
  const classes = useStyles()
//"/static/images/cards/contemplative-reptile.jpg"
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.image}
          title={props.imageTitle}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.text}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button 
          size="small" 
          color="primary"
          onClick={props.onClick}
        >
          <ArrowForwardIosIcon />
        </Button>
      </CardActions>
    </Card>
  )
}

export default (props) => {
  const classes = useStyles()
  const history = useHistory()
  return (<React.Fragment>
      <CenteredBox>
        <Typography variant="h2">Dobro došli u Nazdravlje aplikaciju</Typography>
      </CenteredBox>
      <CenteredBox>
        <Typography variant="h5">Vaše zdravlje u Vašim rukama</Typography>
      </CenteredBox>
      <br />
      <br />
      <br />
      <Grid
        className={classes.cardHeight}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <MediaCard 
          image={one}
          title="Sve bolnice"
          text="Pretražite postojeću bazu zdravstvenih ustanova ili dodajte novu..."
          onClick={_ => history.push('/zdravstvene-ustanove')}
        />&nbsp;&nbsp;
        <MediaCard 
          image={two}
          title="Svi pregledi"
          text="Pretražite bazu Vaših pregleda, podsetite se lekarskih nalaza i saveta ili dodajte novi..."
          onClick={_ => history.push('/pregledi')}
        />&nbsp;&nbsp;
        <MediaCard 
          image={three}
          title="Svi lekari"
          text="Pretražite postojeću bazu lekara ili dodajte novog..."
          onClick={_ => history.push('/lekari')}
        />&nbsp;&nbsp;
      </Grid>
    </React.Fragment>
  )
}