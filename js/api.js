const BASE_URL = env.BASE_URL;
const IMG_URL = env.IMG_URL;

async function fetchMovies(query) {
    let url = '';
    if (query) {
        url = `${BASE_URL}/movies?query=${encodeURIComponent(query)}`;
    } else {
        url = `${BASE_URL}/movies`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.results) return [];
        return data.results.map(processData);
    } catch (error) {
        return [];
    }
}

async function fetchDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
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
            ...processed,
            genres,
            cast,
            releaseDate,
            overview: data.overview // 상세 모달에서 전체 줄거리 필요
        };
    } catch (error) {
        throw new Error('영화 상세 정보를 가져오는데 실패했습니다.');
    }
}

function processData(movie) {
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
    fetchMovies,
    fetchDetails
}; 