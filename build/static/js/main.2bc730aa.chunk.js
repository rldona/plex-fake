(this["webpackJsonpfake-plex-app"]=this["webpackJsonpfake-plex-app"]||[]).push([[0],{19:function(e,t,a){e.exports=a(32)},24:function(e,t,a){},25:function(e,t,a){},26:function(e,t,a){e.exports=a.p+"static/media/godmothered-300496698-mmed.bd43fdf1.jpg"},32:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(17),c=a.n(i),o=(a(24),a(9)),l=a(1),s=(a(25),a(10)),u=a(4),m=a(5),v=a(6),p=a(7),h=(a(26),function(e){Object(p.a)(a,e);var t=Object(v.a)(a);function a(){var e;Object(u.a)(this,a);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).convertMinutesToHours=function(e){var t=e/6e4/60,a=Math.floor(t),n=60*(t-a),r=Math.round(n);return"".concat(a,"h ").concat(r,"m")},e}return Object(m.a)(a,[{key:"navigateTo",value:function(e){var t=this.props,a=t.history,n=t.movie;a.push({pathname:"/movie-detail/".concat(e),state:{movie:n}})}},{key:"render",value:function(){var e=this,t=this.props.movie;return t?r.a.createElement("div",{className:"item ".concat(parseInt(t.ratingAvergae)>=5?parseInt(t.ratingAvergae)>=6?"positiva":"neutral":"negativa"," ").concat(t.viewCount?"viewed":""),onClick:function(){return e.navigateTo(t._id)}},r.a.createElement("img",{src:t.thumbnail,alt:t.title}),r.a.createElement("p",{class:"rating-average"},r.a.createElement("i",{class:"fas fa-heart"})," ","0"===t.ratingAvergae?"-":t.ratingAvergae),r.a.createElement("h2",null,t.title),r.a.createElement("div",{class:"info-extra"},r.a.createElement("p",null,r.a.createElement("i",{class:"fas fa-eye"})," ","0"===t.ratingCount?"-":t.ratingCount),r.a.createElement("p",null,r.a.createElement("i",{class:"fas fa-clock"})," ",this.convertMinutesToHours(t.duration)))):null}}]),a}(n.Component)),f=Object(l.f)(h),d=function(e){Object(p.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).fetchMovieList=function(){var e=n.state,t=e.movieList,a=e.type,r=e.page,i=e.size;fetch("http://34.252.151.163:3000/media?type=".concat(a,"&page=").concat(r,"&limit=").concat(i)).then((function(e){return e.json()})).then((function(e){n.setState((function(a){var r=t.concat(e.data);return Object(s.a)({},n.state,{movieList:r})}))}))},n.loadMoreMovies=function(){n.setState({page:n.state.page+1}),n.fetchMovieList()},n.state={movieList:[],type:"movies",page:1,size:50},n}return Object(m.a)(a,[{key:"componentDidMount",value:function(){this.fetchMovieList()}},{key:"render",value:function(){var e=this,t=this.state.movieList;return 0===t.length?null:(console.log(this.state),r.a.createElement("div",null,r.a.createElement("div",{className:"movie-list"},t.map((function(e,t){return r.a.createElement(f,{key:t,movie:e})}))),r.a.createElement("button",{className:"load-more",onClick:function(){return e.loadMoreMovies()}},"Cargar m\xe1s...")))}}]),a}(n.Component),g=function(e){Object(p.a)(a,e);var t=Object(v.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this,e)).fetchSerieList=function(){var e=n.state.serieList;fetch("http://34.252.151.163:3000/media?type=".concat("series","&page=1&limit=100")).then((function(e){return e.json()})).then((function(t){n.setState((function(a){var r=e.concat(t.data);return Object(s.a)({},n.state,{serieList:r})}))}))},n.loadMoreMovies=function(){n.setState({page:n.state.page+1}),n.fetchserieList()},n.state={serieList:[]},n}return Object(m.a)(a,[{key:"componentDidMount",value:function(){this.fetchSerieList()}},{key:"render",value:function(){var e=this,t=this.state.serieList;return 0===t.length?null:r.a.createElement("div",null,r.a.createElement("div",{className:"movie-list"},t.map((function(e,t){return r.a.createElement(f,{key:t,movie:e})}))),r.a.createElement("button",{className:"load-more",onClick:function(){return e.loadMoreMovies()}},"Cargar m\xe1s..."))}}]),a}(n.Component),E=function(e){Object(p.a)(a,e);var t=Object(v.a)(a);function a(){return Object(u.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){var e=this.props.location.state.movie;if(!e)return null;var t={backgroundImage:"url("+e.thumbnail+")"};return r.a.createElement("div",{className:"movie-detail"},r.a.createElement("div",{className:"thunbnail",style:t}),r.a.createElement("ul",{className:"rating"},r.a.createElement("li",{className:"".concat(parseInt(e.ratingAvergae)>=5?parseInt(e.ratingAvergae)>=6?"positiva":"neutral":"negativa")},e.ratingAvergae),r.a.createElement("li",null,e.ratingCount)),r.a.createElement("h2",null,e.title),r.a.createElement("p",null,e.sinopsis),r.a.createElement("h3",null,"Criticas profesionales:"),r.a.createElement("div",{className:"review-list"},e.reviewList.map((function(e,t){return r.a.createElement("div",{className:"review-item ".concat(e.evaluation),key:t},r.a.createElement("p",{className:"body"},e.body),r.a.createElement("p",null,"(",e.author,")"))}))))}}]),a}(n.Component),b=Object(l.f)(E);var y=function(){return r.a.createElement(o.a,null,r.a.createElement(l.c,null,r.a.createElement(l.a,{exact:!0,path:"/"},r.a.createElement(d,null)),r.a.createElement(l.a,{exact:!0,path:"/movie-list"},r.a.createElement(d,null)),r.a.createElement(l.a,{exact:!0,path:"/serie-list"},r.a.createElement(g,null)),r.a.createElement(l.a,{path:"/movie-detail/:id"},r.a.createElement(b,null))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[19,1,2]]]);
//# sourceMappingURL=main.2bc730aa.chunk.js.map