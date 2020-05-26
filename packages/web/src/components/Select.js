import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SelectInput(props) {
  const classes = useStyles();
  const [state, setState] = React.useState(0);

  const handleChange = (event) => {
    const name = props.name;
    setState({
      [name]: event.target.value,
    })
    props.onSelect(event.target.value)
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">{props.label}</InputLabel>
        <Select
          native
          value={state.age}
          onChange={handleChange}
          inputProps={{
            name: props.name,
            id: 'ocena-native-simple',
          }}
        >
          {props.options.map(o => {
            return <option value={o.value}>{o.label}</option>
          })}
          {/* <option aria-label="None" value="" />
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option> */}
        </Select>
      </FormControl>
    </div>
  );
}