import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

import axios from 'axios';
import axiosWithAuthentication from '../axios'
import { useEffect } from 'react'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [currentArticle, setCurrentArticle] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  

  useEffect(() => {
    setCurrentArticle(articles.find(art => art.article_id === currentArticleId))
  }, [currentArticleId]);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate("/")
    /* ✨ implement */ }
  const redirectToArticles = () => {
    navigate("/articles")
    /* ✨ implement */ }

  const logout = (username, password) => {
    localStorage.removeItem('token');
    setMessage("Goodbye!");
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);

    const creds = { "username": username, "password": password }
    axios.post(loginUrl, { username: username.trim(), password: password.trim() })
    .then(res => {
      localStorage.setItem("token", res.data.token)
      setMessage(res.data.message)
      setSpinnerOn(false)
      redirectToArticles()
    })
      .catch(err => {
        console.log(err);
      })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    setMessage("");
    setSpinnerOn(true);

    axiosWithAuthentication().get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        if (err.status === 401) {
          redirectToLogin()
        }
        setSpinnerOn(false)
      })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    setSpinnerOn(true)
    axiosWithAuthentication().post(articlesUrl, article)
      .then(res => {
        console.log(res.data.message)
        setMessage(res.data.message)
        setSpinnerOn(false)
        setArticles([...articles, article])
      })
      .catch(err => console.log(err))
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const articleHelper = () => {
    axiosWithAuthentication().get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles)
      })
      .catch(err => {
        if (err.status === 401) {
          redirectToLogin()
        }
      })
  }

  const updateArticle = ({ article_id, article }) => {
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuthentication().put(articlesUrl + `/${article_id}`, { title: article.title.trim(), text: article.text.trim(), topic: article.topic })
      .then(res => {
        setMessage(res.data.message)
        articleHelper()
        setSpinnerOn(false)
      })
      .catch(err => console.log(err))
    
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuthentication().delete(articlesUrl + `/${article_id}`)
      .then(res => {
        
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => console.log(err));
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm
                articleHelper={articleHelper}
                getArticles={getArticles}
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                currentArticle={currentArticle}
                setCurrentArticle={setCurrentArticle}
              />
              <Articles
                articleHelper={articleHelper}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                articles={articles}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
