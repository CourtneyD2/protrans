import {GET_POSTS, GET_POST, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, ADD_COMMENT, REMOVE_COMMENT, GET_USERS_POSTS} from '../actions/types'

const initialState ={
  posts: [],
  post: null,
  usersPosts: [],
  loading: true,
  error: {}
}
// eslint-disable-next-line
export default function(state = initialState, action) {
  const {type, payload} =action;

  switch(type){
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      }
    case GET_USERS_POSTS:
      return {
        ...state,
        usersPosts: payload.ThePosts.filter((thepost) => thepost.user === payload.userId),
        loading: false
      }  
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      }  
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      }
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map (post => post._id === payload.postId ? {...post, like: payload.likes} : post ),
        usersPosts: state.usersPosts.length<=0 ? state.usersPosts : state.usersPosts.map (post => post._id === payload.postId ? {...post, like: payload.likes} : post ),
        loading: false
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        usersPosts: state.usersPosts.length<=0 ? state.usersPosts : state.usersPosts.filter(post => post._id !== payload),
        loading: false
      }
    case ADD_COMMENT:
      return {
        ...state,
        post: {...state.post, comments: payload },
        loading: false
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {...state.post, comments: state.post.comments.filter(comment => comment._id !== payload) },
        loading: false
      }  
    case POST_ERROR: 
      return {  
        ...state,
        error: payload,
        loading: false
      }
    default: 
      return state;
  }

}