import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Box from '@material-ui/core/Box'

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

export default function CustomizedRatings({ 
  value, 
  disabled,
  readOnly,
  onChangeRating
}) {
  return <Box component="fieldset" mb={3} borderColor="transparent">
    <StyledRating
      onChange={(event, value) => {
        onChangeRating(value)
      }}
      value={value}
      size="medium"
      readOnly={readOnly}
      disabled={disabled}
      name="customized-color"
      getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
      precision={1}
      icon={<FavoriteIcon fontSize="inherit" />}
    />
  </Box>
}