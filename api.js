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
            console.log('TMDB API 응답 데이터:', data);
            return data.results;
        })
        .catch(error => {
            console.error('영화 데이터를 가져오는 중 오류 발생:', error);
            return [];
        });
}

// 영어 요약 가져오기
function fetchEnOverview(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    return fetch(url)
        .then(res => res.json())
        .catch(err => {
            console.error(`영어 요약 가져오기 실패 (ID: ${movieId})`, err);
            return { overview: null };
        });
}

// 영화 상세 정보 가져오기
function fetchDetails(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`;
    
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.overview || data.overview.trim() === '') {
                // 한국어 요약이 없으면 영어 버전 가져오기
                return fetchEnOverview(movieId)
                    .then(enData => {
                        data.overview = enData.overview || '요약 정보가 없습니다.';
                        return data;
                    });
            } else {
                return data;
            }
        })
        .catch(error => {
            console.error('영화 상세 정보 가져오기 실패:', error);
            throw new Error('영화 상세 정보를 가져오는데 실패했습니다.');
        });
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