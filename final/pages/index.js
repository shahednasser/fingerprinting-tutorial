import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Container, Image, Row, Spinner } from 'react-bootstrap'
var faker = require('faker')
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import axios from 'axios';
import DarkModeToggle from "react-dark-mode-toggle";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [visitorId, setVisitorId] = useState(null)

  useEffect(() => {
    const tempPosts = [];
    for (let i = 0; i < 10; i++) {
      tempPosts.push({
        user: {
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          avatar: faker.image.avatar(),
        },
        title: faker.lorem.words(2),
        content: faker.lorem.sentence()
      });
    }
    setPosts(tempPosts);
    setLoading(false);
  }, [])

  useEffect(() => {
    if (!visitorId) {
      const fpPromise = FingerprintJS.load({ token: '5okhL6JgnGrzKan4dLFj' })

      fpPromise
        .then(fp => fp.get())
        .then(result => {
          console.log(result.visitorId)
          axios.get(`/api/user/${result.visitorId}/${isDarkMode ? 1 : 0}`)
            .then((response) => {
              const responseData = response.data;
              if (responseData.hasOwnProperty('darkMode')) {
                setVisitorId(result.visitorId)
                setIsDarkMode(responseData.darkMode == 1)
              }
            })
            .catch((err) => {
              console.error(err);
            });
        })
    } else {
      if (isDarkMode) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
      axios.post(`/api/user/${visitorId}/${isDarkMode ? 1 : 0}`)
        .catch(err => console.error(err))
    }
  }, [isDarkMode, visitorId])

  return (
    <div>
      <Head>
        <title>Posts</title>
        <meta name="description" content="Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="pt-3">
        <div className="text-end">
          <DarkModeToggle
            onChange={setIsDarkMode}
            checked={isDarkMode}
            size={80}
          />
        </div>
        {loading && <Spinner animation="border" variant="primary" />}
        {!loading && (
          <Row className="mx-auto pt-2">
            {
              posts.map((post, index) => (
                <Col key={index} xs={6} className="mb-3">
                  <Card>
                    <Card.Title className="p-3">
                      {post.title}
                    </Card.Title>
                    <Card.Body>
                      {post.content}
                    </Card.Body>
                    <Card.Footer>
                      <Image src={post.user.avatar} alt={post.user.name} thumbnail={true} roundedCircle={true} style={{height: '3rem'}} className="border-0 bg-transparent" />
                      <span className="text-muted">{post.user.name}</span>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            }
          </Row>
        )}
      </Container>
    </div>
  )
}
