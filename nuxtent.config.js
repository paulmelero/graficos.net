module.exports = {
  content: {
    permalink: ':slug',
    page: '/blog/_content',
    generate: [ // for static build
      'get',
      'getAll'
    ],
    isPost: false
  },
  api: {
    baseURL: 'http://localhost:80',
    browserBaseURL: 'http://localhost:80'
  }
}
