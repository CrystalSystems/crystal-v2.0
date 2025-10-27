// PostPreview.jsx
import {
  useState,
  useEffect,
  useRef,
  forwardRef
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { httpClient } from '../../shared/api';
import { API_BASE_URL } from '../../shared/constants';
import { useAuthData } from "../../features";
import { setShowAccessModal } from '../../features/accessModal/accessModalSlice';
import {
  useFormattedPostDate,
  useUserStatus
} from '../../shared/hooks';
import {
  formatLinksInText,
  formatLongNumber,
  isSamePostDate
} from '../../shared/helpers';
import {
  NoAvatarIcon,
  ThreeDotsIcon,
  EyeIcon,
  CrystalIcon,
  RepostIcon,
  BookmarkIcon,
  LinkIcon,
  LikeIcon,
  MessagesIcon,
  PulseLineIcon,
  GifInCircleIcon,
  WordGifIcon,
  UserOnlineStatusCircleIcon
} from '../../shared/ui';

import styles from './PostPreview.module.css';

export const PostPreview = forwardRef(function Post(props, lastPostRef) {

  // authorized user
  const { authorizedUser } = useAuthData();
  // /authorized user

  // checking user log in
  const logInStatus = useSelector((state) => state.logInStatus)
  // /checking user log in

  const darkThemeStatus = useSelector((state) => state.darkThemeStatus);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ...post } = props;
  const linkToUserProfile = window.location.origin + '/' + post.data.user?.customId;
  const userAvatar = API_BASE_URL + post.data.user?.avatarUri;
  const mainImage = API_BASE_URL + post.data.mainImageUri;
  const queryClient = useQueryClient();

  const { userOnline } = useUserStatus(post?.data?.user?.customId, { delay: 100 });
 
  // menu - post options
  const menuPostOptions = useRef();
  const [showMenuPostOptions, setShowMenuPostOptions] = useState(false);
  const [fadeOutMenuPostOptions, setFadeOutMenuPostOptions] = useState(false);
  const buttonShowMenuPostOptions = (Visibility) => {
    if (Visibility) {
      setShowMenuPostOptions(true);
    } else {
      setFadeOutMenuPostOptions(true);
    }
  };

  // closing a menu when clicking outside its field
  useEffect(() => {
    if (menuPostOptions.current) {
      const handler = (e) => {
        e.stopPropagation();
        if (!menuPostOptions.current.contains(e.target)) {
          setFadeOutMenuPostOptions(true);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => {
        document.removeEventListener('mousedown', handler);
      };
    }
  });
  // /Closing a menu when clicking outside its field
  // /menu - post options

  // post options

  // delete post
  const onClickDeletePost = async (event) => {
    event.preventDefault();
    if (window.confirm(t("PostPreview.DeletePostQuestion"))) {
      await httpClient.delete(`/posts/${post.data._id}`);
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    }
  };
  // /delete post

  // delete all posts
  const onClickDeleteAllPosts = async (event) => {
    event.preventDefault();
    if (window.confirm(t("PostPreview.DeleteAllUserPostsQuestion"))) {
      await httpClient.delete(`/posts/user/${post.data.user.customId}`);
      queryClient.invalidateQueries({
        queryKey: ['posts']
      });
      queryClient.invalidateQueries({
        queryKey: ['users']
      });
    }
  };
  // /delete all posts

  // delete user account
  const onClickDeleteUserAccount = async (event) => {
    event.preventDefault();
    if (window.confirm(t('PostPreview.DeleteAccountQuestion'))) {
      setFadeOutMenuPostOptions(true);
      await httpClient.delete(`/users/${post.data.user.customId}`);
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    }
  };
  // /delete user account

  // /post options

  // add like and scheck authorized user
  // 🌟 ИЗМЕНЕНО: Инициализация состояний из новых полей, возвращаемых бэкендом
  const [userLiked, setUserLiked] = useState(post.data?.isLikedByMe || false);
  const [numberLiked, setNumberLiked] = useState(post.data?.likesCount || 0);

console.log(post.data?.isLikedByMe)

  // ❌ УДАЛЕН старый useEffect для ручного расчета статуса лайка

  const onClickAddLike = async () => {
    // Проверка авторизации
    if (!authorizedUser) {
      dispatch(setShowAccessModal(true));
      return;
    }

    // 1. Оптимистическое обновление UI
    const currentlyLiked = userLiked;
    setUserLiked(!currentlyLiked);
    setNumberLiked(currentlyLiked ? numberLiked - 1 : numberLiked + 1);

    // 2. Выполнение запроса к API (без body, ID пользователя берется из middleware)
    try {
      const response = await httpClient.patch(`/posts/${post.data._id}/like`);
      
      // 3. Обновление UI по ответу (если ответ от бэкенда отличается от оптимистичного)
      if (response.liked !== undefined && response.liked !== !currentlyLiked) {
          // Откат к состоянию, которое прислал бэкенд
          setUserLiked(response.liked);
          // Корректируем счетчик
          setNumberLiked(response.liked ? numberLiked + 1 : numberLiked - 1);
      }
    } catch (error) {
      // 4. Откат при ошибке
      setUserLiked(currentlyLiked);
      setNumberLiked(currentlyLiked ? numberLiked + 1 : numberLiked - 1);
      // ... здесь можно добавить обработку ошибки
    }
  };
  // /add like and scheck authorized user

  // format post date
  const created = useFormattedPostDate(post.data?.createdAt, false);
  const updated = useFormattedPostDate(post.data?.updatedAt, false);
  // /format post date

  return (

    <div
      className={styles.post_wrap}
      data-post-preview-dark-theme={darkThemeStatus}
    >
      <Link ref={lastPostRef} to={'/posts/' + post.data._id}></Link>
      <div className={styles.post}>
        <div className={styles.post_info_top}>
          {post.data?.user === null ? (
            <div className={styles.user_info}>
              <div className={styles.no_avatar_icon}>
                <NoAvatarIcon />
              </div>
              <div className={styles.user_name}>
                <p>{t('PostPreview.UserDeleted')}</p>
              </div>
            </div>
          ) : (
            <div className={styles.user_info}>
              <Link to={linkToUserProfile}></Link>
              {post.data.user?.avatarUri ? (
                <div className={styles.avatar}>
                  {post.data.user?.avatarUri?.endsWith('.gif') && authorizedUser?.settings.interface.hideGif ? (
                    <div className={styles.gif_circle_icon}>
                      <GifInCircleIcon />
                    </div>
                  ) : (
                    <img src={userAvatar} alt="user avatar" />
                  )}
                  {(userOnline) && (
                    <div className={styles.user_online_status_circle_icon_avatar}>
                      <UserOnlineStatusCircleIcon />
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.no_avatar_icon}>
                  <NoAvatarIcon />
                  {(userOnline) && (
                    <div className={styles.user_online_status_circle_icon_no_avatar}>
                      <UserOnlineStatusCircleIcon />
                    </div>
                  )}
                </div>
              )}
              <div className={styles.user_name_user_custom_id_wrap}>
                <div className={styles.user_name_wrap}>
                  <div className={styles.user_name}>
                    <p>{post.data.user?.name}</p>
                  </div>
                  {post.data.user?.creator && (
                    <div className={styles.crystal_icon}>
                      <CrystalIcon />
                    </div>
                  )}
                </div>
                <div className={styles.user_custom_id}>
                  <p>{'@' + post.data.user?.customId}</p>
                </div>
              </div>
            </div>
          )}
          <button
            className={styles.options}
            onClick={() =>
              logInStatus ?
                buttonShowMenuPostOptions(!showMenuPostOptions)
                :
                dispatch(setShowAccessModal(true))
            }
          >
            <ThreeDotsIcon />
          </button>
          {showMenuPostOptions && (
            <div
              ref={menuPostOptions}
              className={
                fadeOutMenuPostOptions
                  ? `${styles.options_menu} ${styles.options_menu_fade_out}`
                  : styles.options_menu
              }
              onAnimationEnd={(e) => {
                if (e.animationName === styles.fadeOut) {
                  setShowMenuPostOptions(false);
                  setFadeOutMenuPostOptions(false);
                }
              }}
            >
              <ul>
                {((post.data.user?._id === authorizedUser?._id && post.data?.user?._id !== undefined) ||
                  authorizedUser?.creator) && (
                    <>
                      <li>
                        {t('PostPreview.EditPost')}
                        <Link to={`/posts/${post.data._id}/edit`}></Link>
                      </li>
                      <li onClick={onClickDeletePost}>{t('PostPreview.DeletePost')}</li>
                    </>
                  )}
                {(post.data.user?._id !== authorizedUser?._id && authorizedUser?.creator) && (
                  <>
                    <li onClick={onClickDeleteAllPosts}>
                      {t('PostPreview.DeleteAllUserPosts')}
                    </li>
                    <li onClick={onClickDeleteUserAccount}>
                      {t('PostPreview.DeleteUser')}
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
        {post.data?.title && (
          <div className={styles.post_title}>
            <h2>
              {formatLinksInText(post.data?.title)}
            </h2>
          </div>
        )}
        {post.data?.text && (
          <div className={post.data.mainImageUri ? styles.post_text_preview : styles.post_text_long}>
            <p>{formatLinksInText(post.data.text)}</p>
          </div>
        )}

        {post.data.mainImageUri && (
          post.data.mainImageUri?.endsWith('.gif') && authorizedUser?.settings.interface.hideGif ? (
            <div className={styles.word_gif_icon_main_image}>
              <WordGifIcon />
            </div>) :
            <div className={styles.post_image}>
              <img src={mainImage} alt="" />
            </div>

        )}
        {/* post publication date   */}
        <div className={styles.post_date_wrap}>
          <div className={styles.post_date_creation}>
            {!isSamePostDate(post.data?.createdAt, post.data?.updatedAt)}
            {created?.element}
          </div>
          {!isSamePostDate(post.data?.createdAt, post.data?.updatedAt) &&
            <div className={styles.post_date_update_wrap}>
              <div className={styles.post_date_separator}><PulseLineIcon /></div>
              <div className={styles.post_date_update}>
                <p>{t('PostPreview.upd')}:</p>
                {updated?.element}
              </div>
            </div>
          }
        </div>
        {/* /post publication date   */}

        <div className={styles.post_info_bottom}>
          <div className={styles.post_info_bottom_part_1}>
            <div className={styles.post_info_bottom_part_1_1}>
              <div className={styles.eye}>
                <EyeIcon />
                {post.data?.views > 0 &&
                  <p>{formatLongNumber(post.data?.views)}</p>}
              </div>
            </div>
            {/* 🌟 УДАЛЕН: проверка userLikedStatus и связанный с ней лоадер */}
            <div
              className={styles.post_info_bottom_part_1_2}
            >
              <div className={styles.link_wrap}>
                <button className={styles.link}>
                  <LinkIcon />
                </button>
              </div>
              <div className={styles.link_bookmark_repost_like_wrap}>
                <button className={styles.repost}>
                  <RepostIcon />
                </button>
                <button className={styles.bookmark}>
                  <BookmarkIcon />
                </button>
                <button className={styles.messages}>
                  <MessagesIcon />
                </button>
                <div className={styles.like_wrap}>
                  <button
                    onClick={onClickAddLike} // 🌟 ИЗМЕНЕНО: теперь вызывает onClickAddLike напрямую
                    className={
                      userLiked ?
                        styles.like_liked
                        :
                        styles.like
                    }
                  >
                    <LikeIcon />
                  </button>
                  {numberLiked > 0 && <p>{formatLongNumber(numberLiked)}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
},
);