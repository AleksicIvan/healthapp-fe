import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'

import { uploadToS3 } from '@healthapp/common/services/file-upload'
import { addReport } from '@healthapp/common/services/reports'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}))

export default function UploadButton(props) {
  const classes = useStyles()

  const handleUploadFile = fileList => {
    const file = fileList[0]
    uploadToS3(props.userId, props.healthCheck.id, file)
      .then(res => {
        addReport({
          healthCheck: {
            id: props.healthCheck.id
          },
          s3FileUrl: res?.data?.s3FileUrl
        })
        .then(result => {
          props.onUpload(result)
        })

      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div className={classes.root}>
      <input 
        accept="image/*, application/pdf" 
        className={classes.input} 
        id="icon-button-file" 
        type="file" 
        onChange={event => {
          handleUploadFile(event.target.files)
        }}
      />
      <label htmlFor="icon-button-file">
        <IconButton 
          color="primary" 
          aria-label="upload picture" 
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>
    </div>
  );
}
