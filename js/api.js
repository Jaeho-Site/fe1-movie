const API_KEY = config.API_KEY;
const BASE_URL = config.BASE_URL;
const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=`;
const IMG_URL = config.IMG_URL;

async function fetchMovies(url) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!data.results) return [];
        return await Promise.all(
            data.results.map(async movie => {
                if (!movie.overview || movie.overview.trim() === '') {
                    const enData = await fetchEnOverview(movie.id);
                    movie.overview = enData.overview || '요약이 없습니다.';
                }
                return processData(movie);
            })
        );
    } catch (error) {
        return [];
    }
}
async function fetchEnOverview(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        return { overview: null };
    }
}
async function fetchDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.overview || data.overview.trim() === '') {
            const enData = await fetchEnOverview(movieId);
            data.overview = enData.overview || '요약 정보가 없습니다.';
        }
        const processed = processData(data);
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
            ...processed,genres,cast,releaseDate,overview: data.overview 
        };
    } catch (error) {
        throw new Error('영화 상세 정보를 가져오는데 실패했습니다.');
    }
}
function processData(movie) {
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
        ...movie, posterUrl, rating, stars, shortOverview: overview
    };
}
const movieAPI = {
    API_URL,
    SEARCH_URL,
    IMG_URL,
    fetchMovies,
    fetchEnOverview,
    fetchDetails
}; 