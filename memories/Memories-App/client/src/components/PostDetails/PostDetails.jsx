import React, {useEffect, useState} from 'react'
import {Paper, Typography, CircularProgress, Divider} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {useParams, useHistory} from 'react-router-dom';
import useStyles from './styles';
import {getPost, getPostsBySearch} from '../../actions/posts';
import CommentSection from './CommentSection';
import Dialogbox from '../../utility/Dialogbox';

const PostDetails = () => {
  const {post, posts, isLoading} = useSelector((state)=>state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const {id} = useParams();
  const defaultLink = 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'

  useEffect(()=>{
    dispatch(getPost(id));
  },[id])

  useEffect(()=>{
    if(post){ 
      dispatch(getPostsBySearch({search: 'none', tags: post?.tags.join(',')}))
    }
  }, [post])

  if(!post){
    return(
      <Dialogbox textMessage={'Post not found'} buttonMessage={'Okay'} onClick={()=>history.push('/posts')}/>
    )
  }

  if(isLoading){
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em"/>
      </Paper>
    ) 
  }

  const recommendedPosts = posts.filter(({_id})=>_id!==post._id) 
  
  const openPost = (_id) => history.push(`/posts/${_id}`)

  return (
   <Paper style={{padding: '20px', borderRadius: '15px'}} elevation={6}>
    <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          
          <Divider style={{ margin: '20px 0' }} />
          
          <CommentSection post={post}/>
        </div>

        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || defaultLink} alt={post.title} />
        </div>

      </div>
      {recommendedPosts?.length ? (
        <div className={classes.section}>
          <Divider/>

          <Typography style = {{marginTop: '1rem'}} variant ="h5">You might also like: </Typography>
          
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({title, message, name, likes, selectedFile, _id})=>(
              <div style={{margin: '20px', cursor: "pointer"}} onClick={() => openPost(_id)} key = {_id}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                
                <img className={classes.media} src={selectedFile || defaultLink} alt={title} style ={{width: "200px"}}/>
              </div>
            ))}
          </div>
        </div>
      ):""}
   </Paper>
  )
}

export default PostDetails