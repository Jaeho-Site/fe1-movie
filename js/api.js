// TMDB API 관련 설정
const API_KEY = config.API_KEY;
const BASE_URL = config.BASE_URL;
const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=`;
const IMG_URL = config.IMG_URL;

// 영화 목록 데이터 가져오기
function fetchMovies(url) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (!data.results) return [];
            return Promise.all(
                data.results.map(async movie => {
                    if (!movie.overview || movie.overview.trim() === '') {
                        const enData = await fetchEnOverview(movie.id);
                        movie.overview = enData.overview || '요약이 없습니다.';
                    }
                    return processMovieData(movie);
                })
            );
        })
        .catch(error => {
            console.error('영화 데이터를 가져오는 중 오류 발생:', error);
            return [];
        });
}

function fetchEnOverview(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    return fetch(url)
        .then(res => res.json())
        .catch(err => {
            console.error(`영어 요약 가져오기 실패 (ID: ${movieId})`, err);
            return { overview: null };
        });
}

function fetchDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`;
    
    return fetch(url)
        .then(response => response.json())
        .then(async data => {
            if (!data.overview || data.overview.trim() === '') {
                const enData = await fetchEnOverview(movieId);
                data.overview = enData.overview || '요약 정보가 없습니다.';
            }
            let posterUrl = '';
            if (data.poster_path) {
                posterUrl = IMG_URL + data.poster_path;
            } else {
                posterUrl = 'https://movie-phinf.pstatic.net/20210728_221/1627440327667GyoYj_JPEG/movie_image.jpg';
            }
            const rating = data.vote_average / 2;
            let stars = '';
            for (let i = 0; i < Math.floor(rating); i++) stars += '⭐';
            if (rating % 1 >= 0.5) stars += '⭐';

            let genres = '';
            if (data.genres && data.genres.length > 0) {
                genres = data.genres.map(g => g.name).join(', ');
            }

            let cast = '';
            if (data.credits && data.credits.cast && data.credits.cast.length > 0) {
                cast = data.credits.cast.slice(0, 5).map(a => a.name).join(', ');
            }

            let releaseDate = '';
            if (data.release_date) {
                releaseDate = new Date(data.release_date).toLocaleDateString('ko-KR');
            }

            return {
                ...data,
                posterUrl,
                rating,
                stars,
                genres,
                cast,
                releaseDate
            };
        })
        .catch(error => {
            console.error('영화 상세 정보 가져오기 실패:', error);
            throw new Error('영화 상세 정보를 가져오는데 실패했습니다.');
        });
}

function processMovieData(movie) {
    // 포스터
    let posterUrl = '';
    if (movie.poster_path) {
        posterUrl = IMG_URL + movie.poster_path;
    } else {
        posterUrl = 'https://movie-phinf.pstatic.net/20210728_221/1627440327667GyoYj_JPEG/movie_image.jpg';
    }

    const rating = movie.vote_average / 2;
    let stars = '';
    for (let i = 0; i < Math.floor(rating); i++) stars += '⭐';
    if (rating % 1 >= 0.5) stars += '⭐';

    let overview = movie.overview && movie.overview.trim().length > 0 ? movie.overview : '';
    if (overview.length > 100) {
        overview = overview.substring(0, 100) + '...';
    }

    return {
        ...movie,
        posterUrl,
        rating,
        stars,
        shortOverview: overview
    };
}

// 외부에서 사용할 수 있도록 내보내기
const movieAPI = {
    API_URL,
    SEARCH_URL,
    IMG_URL,
    fetchMovies,
    fetchEnOverview,
    fetchDetails
}; 