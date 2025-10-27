//HashtagPage.jsx

import { useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuthData } from '../../features'; 

import { Loader } from '../../shared/ui';
import { NotFoundPage } from '../../pages';
import { PostPreview } from '../../widgets';
import { httpClient } from '../../shared/api';

import styles from './HashtagPage.module.css';

export function HashtagPage() {
  const { tag } = useParams();
  const link = '/posts/hashtags';
  
  // Authorized user
  const { authorizedUser } = useAuthData(); 

  const getPostsPage = async ({ cursor, limitPosts = 5 }) => {
    const authId = authorizedUser?._id;
    const params = { limit: limitPosts, tag };
    
    // Add ID to params if the user is authorized
    if (authId) {
        params.authorizedUserId = authId;
    }

    if (cursor) {
      params.cursor = cursor;
    }
    const response = await httpClient.get(link, params);
    return response;
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    isPending, // <--- isPending is used for the first load
    isSuccess,
    error,
  } = useInfiniteQuery({
    // Add ID to queryKey to reset data when logging in/out
    queryKey: ['posts', 'hashtagPagePosts', tag, authorizedUser?._id], 
    queryFn: ({ pageParam }) => getPostsPage({ cursor: pageParam }),
    initialPageParam: null,
    refetchOnWindowFocus: true,
    retry: false,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor || undefined; // Cursor pagination
    },
  });

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;
      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (post) intObserver.current.observe(post);
    },

    [isFetchingNextPage, isPending, fetchNextPage, hasNextPage]
  );

  const posts = data?.pages.flatMap((page) =>
    page.posts.map((post, index) => {
      if (page.posts.length === index + 1) {
        return (
          <PostPreview
            ref={lastPostRef}
            data={post}
            key={post._id}
          />
        );
      }
      return (
        <PostPreview
          data={post}
          key={post._id}
        />
      );
    })
  );

  return (
    <div className={styles.likes_page}>
      <div className={styles.title}>
        <h1>#{tag}</h1>
      </div>

      <div className={styles.posts_wrap}>
        {isSuccess && data?.pages[0]?.posts?.length === 0 && (
          <NotFoundPage />
        )}

        {isPending && (
          <div className={styles.loader_first_loading}>
            <div className={styles.loader}>
              <Loader />
            </div>
          </div>
        )}

        {isSuccess && posts}

        {isFetchingNextPage && (
          <div className={styles.loader_infinite_scroll}>
            <div className={styles.loader}>
              <Loader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}