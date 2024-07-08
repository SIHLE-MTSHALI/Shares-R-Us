import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/articles/${id}`)
      .then(response => setArticle(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="article-container p-4">
      <h1 className="text-3xl mb-4">{article.title}</h1>
      <p className="text-sm text-gray-600">By {article.author} on {new Date(article.published_at).toLocaleDateString()}</p>
      <div className="article-body mt-4">
        {article.body}
      </div>
    </div>
  );
};

export default Article;
