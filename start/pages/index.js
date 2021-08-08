import Head from 'next/head'
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Container, Image, Row, Spinner } from 'react-bootstrap'
var faker = require('faker')

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([])

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

  return (
    <div>
      <Head>
        <title>Posts</title>
        <meta name="description" content="Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="pt-3">
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
