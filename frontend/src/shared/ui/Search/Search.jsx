//Search.jsx

import { useState, useEffect } from 'react'; // 💡 MODIFIED: Добавляем useEffect
import { useNavigate, useLocation } from 'react-router-dom'; // 💡 MODIFIED: Добавляем useLocation
import { useSelector } from 'react-redux';
import {
  SearchIcon,
  DeleteTextInSearchIcon
} from '../../../shared/ui';

import styles from './Search.module.css';

export function Search() {
  const navigate = useNavigate();
  const location = useLocation(); // 💡 NEW: Хук для доступа к текущему URL

  // 1. 💡 NEW: Логика инициализации query из адресной строки
  // Мы будем использовать useEffect, чтобы прочитать и установить значение.
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Парсим query-параметры из текущего URL
    const params = new URLSearchParams(location.search);
    const q = params.get('q');

    // Если параметр 'q' существует, устанавливаем его в состояние query
    // Используем '|| '' для безопасности, чтобы избежать null
    setQuery(q || '');
  }, [location.search]); // 💡 Зависимость от location.search, чтобы обновлять при смене URL

  const darkThemeStatus = useSelector((state) => state.darkThemeStatus);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    // Если запрос пуст, переходим на /search без параметра 'q'
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // 💡 Если строка пуста, переходим на базовый адрес поиска, 
      // чтобы очистить 'q' из URL (например, с /search?q=old на /search)
      navigate('/search');
    }
  };

  // 💡 MODIFIED: Функция для очистки строки поиска
  const handleClearSearch = () => {
    setQuery('');
    // 💡 При очистке поля, сбрасываем query-параметр в URL, 
    // чтобы SearchPage тоже очистился
    const currentPath = location.pathname;
    // Если мы на странице /search, переходим на /search без параметров
    if (currentPath.startsWith('/search')) {
      navigate('/search');
    }
  };

  return (
    <div
      className={styles.search}
      data-search-dark-theme={darkThemeStatus}
    >
      <form role="search" onSubmit={handleSearch}>

        {/* Кнопка-крестик (X) для очистки */}
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            className={styles.clear_icon}
            aria-label="Clear search bar"
          >
            <DeleteTextInSearchIcon />
          </button>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className={styles.search_icon}
          type="submit"
          aria-label="Start search"
          disabled={!query.trim()}
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}