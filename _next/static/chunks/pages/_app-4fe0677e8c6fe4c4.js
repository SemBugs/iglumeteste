(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{6840:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(3126)}])},2345:function(e,t){"use strict";t.Z={src:"/calculadora-lajes/_next/static/media/logo.f4dbc4e9.png",height:180,width:636,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAACCAMAAABSSm3fAAAAGFBMVEUCJDkHGj4JJjkAITbZjxHbjBHjkg8AAEUM9Qg1AAAACHRSTlNWOUILTfz8LHNkGhEAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAaSURBVHicY2BjY2FnZGBgZmBlZWFkYmJgBgACGgAyu6UYcAAAAABJRU5ErkJggg==",blurWidth:8,blurHeight:2}},6691:function(e,t){"use strict";var r,n,o,i;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ACTION_FAST_REFRESH:function(){return f},ACTION_NAVIGATE:function(){return l},ACTION_PREFETCH:function(){return c},ACTION_REFRESH:function(){return a},ACTION_RESTORE:function(){return s},ACTION_SERVER_ACTION:function(){return d},ACTION_SERVER_PATCH:function(){return u},PrefetchCacheEntryStatus:function(){return n},PrefetchKind:function(){return r},isThenable:function(){return p}});let a="refresh",l="navigate",s="restore",u="server-patch",c="prefetch",f="fast-refresh",d="server-action";function p(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(o=r||(r={})).AUTO="auto",o.FULL="full",o.TEMPORARY="temporary",(i=n||(n={})).fresh="fresh",i.reusable="reusable",i.expired="expired",i.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4318:function(e,t,r){"use strict";function n(e,t,r,n){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return n}}),r(8364),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6541:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Image",{enumerable:!0,get:function(){return j}});let n=r(8754),o=r(1757),i=r(5893),a=o._(r(7294)),l=n._(r(3935)),s=n._(r(7828)),u=r(7367),c=r(7903),f=r(4938);r(1997);let d=r(9953),p=n._(r(6663)),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/calculadora-lajes/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0};function h(e,t,r,n,o,i,a){let l=null==e?void 0:e.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&o(!0),null==r?void 0:r.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let n=!1,o=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>n,isPropagationStopped:()=>o,persist:()=>{},preventDefault:()=>{n=!0,t.preventDefault()},stopPropagation:()=>{o=!0,t.stopPropagation()}})}(null==n?void 0:n.current)&&n.current(e)}}))}function m(e){return a.use?{fetchPriority:e}:{fetchpriority:e}}let v=(0,a.forwardRef)((e,t)=>{let{src:r,srcSet:n,sizes:o,height:l,width:s,decoding:u,className:c,style:f,fetchPriority:d,placeholder:p,loading:g,unoptimized:v,fill:b,onLoadRef:j,onLoadingCompleteRef:y,setBlurComplete:_,setShowAltText:x,sizesInput:w,onLoad:C,onError:A,...E}=e;return(0,i.jsx)("img",{...E,...m(d),loading:g,width:s,height:l,decoding:u,"data-nimg":b?"fill":"1",className:c,style:f,sizes:o,srcSet:n,src:r,ref:(0,a.useCallback)(e=>{t&&("function"==typeof t?t(e):"object"==typeof t&&(t.current=e)),e&&(A&&(e.src=e.src),e.complete&&h(e,p,j,y,_,v,w))},[r,p,j,y,_,A,v,w,t]),onLoad:e=>{h(e.currentTarget,p,j,y,_,v,w)},onError:e=>{x(!0),"empty"!==p&&_(!0),A&&A(e)}})});function b(e){let{isAppRouter:t,imgAttributes:r}=e,n={as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy,...m(r.fetchPriority)};return t&&l.default.preload?(l.default.preload(r.src,n),null):(0,i.jsx)(s.default,{children:(0,i.jsx)("link",{rel:"preload",href:r.srcSet?void 0:r.src,...n},"__nimg-"+r.src+r.srcSet+r.sizes)})}let j=(0,a.forwardRef)((e,t)=>{let r=(0,a.useContext)(d.RouterContext),n=(0,a.useContext)(f.ImageConfigContext),o=(0,a.useMemo)(()=>{let e=g||n||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r}},[n]),{onLoad:l,onLoadingComplete:s}=e,h=(0,a.useRef)(l);(0,a.useEffect)(()=>{h.current=l},[l]);let m=(0,a.useRef)(s);(0,a.useEffect)(()=>{m.current=s},[s]);let[j,y]=(0,a.useState)(!1),[_,x]=(0,a.useState)(!1),{props:w,meta:C}=(0,u.getImgProps)(e,{defaultLoader:p.default,imgConf:o,blurComplete:j,showAltText:_});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(v,{...w,unoptimized:C.unoptimized,placeholder:C.placeholder,fill:C.fill,onLoadRef:h,onLoadingCompleteRef:m,setBlurComplete:y,setShowAltText:x,sizesInput:e.sizes,ref:t}),C.priority?(0,i.jsx)(b,{isAppRouter:!r,imgAttributes:w}):null]})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9577:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return y}});let n=r(8754),o=r(5893),i=n._(r(7294)),a=r(1401),l=r(2045),s=r(7420),u=r(7201),c=r(1443),f=r(9953),d=r(5320),p=r(2905),g=r(4318),h=r(953),m=r(6691),v=new Set;function b(e,t,r,n,o,i){if(i||(0,l.isLocalURL)(t)){if(!n.bypassPrefetchedCheck){let o=t+"%"+r+"%"+(void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0);if(v.has(o))return;v.add(o)}(async()=>i?e.prefetch(t,o):e.prefetch(t,r,n))().catch(e=>{})}}function j(e){return"string"==typeof e?e:(0,s.formatUrl)(e)}let y=i.default.forwardRef(function(e,t){let r,n;let{href:s,as:v,children:y,prefetch:_=null,passHref:x,replace:w,shallow:C,scroll:A,locale:E,onClick:P,onMouseEnter:S,onTouchStart:O,legacyBehavior:M=!1,...R}=e;r=y,M&&("string"==typeof r||"number"==typeof r)&&(r=(0,o.jsx)("a",{children:r}));let k=i.default.useContext(f.RouterContext),I=i.default.useContext(d.AppRouterContext),T=null!=k?k:I,z=!k,N=!1!==_,L=null===_?m.PrefetchKind.AUTO:m.PrefetchKind.FULL,{href:B,as:U}=i.default.useMemo(()=>{if(!k){let e=j(s);return{href:e,as:v?j(v):e}}let[e,t]=(0,a.resolveHref)(k,s,!0);return{href:e,as:v?(0,a.resolveHref)(k,v):t||e}},[k,s,v]),F=i.default.useRef(B),D=i.default.useRef(U);M&&(n=i.default.Children.only(r));let H=M?n&&"object"==typeof n&&n.ref:t,[G,K,J]=(0,p.useIntersection)({rootMargin:"200px"}),V=i.default.useCallback(e=>{(D.current!==U||F.current!==B)&&(J(),D.current=U,F.current=B),G(e),H&&("function"==typeof H?H(e):"object"==typeof H&&(H.current=e))},[U,H,B,J,G]);i.default.useEffect(()=>{T&&K&&N&&b(T,B,U,{locale:E},{kind:L},z)},[U,B,K,E,N,null==k?void 0:k.locale,T,z,L]);let W={ref:V,onClick(e){M||"function"!=typeof P||P(e),M&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),T&&!e.defaultPrevented&&function(e,t,r,n,o,a,s,u,c){let{nodeName:f}=e.currentTarget;if("A"===f.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!c&&!(0,l.isLocalURL)(r)))return;e.preventDefault();let d=()=>{let e=null==s||s;"beforePopState"in t?t[o?"replace":"push"](r,n,{shallow:a,locale:u,scroll:e}):t[o?"replace":"push"](n||r,{scroll:e})};c?i.default.startTransition(d):d()}(e,T,B,U,w,C,A,E,z)},onMouseEnter(e){M||"function"!=typeof S||S(e),M&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),T&&(N||!z)&&b(T,B,U,{locale:E,priority:!0,bypassPrefetchedCheck:!0},{kind:L},z)},onTouchStart:function(e){M||"function"!=typeof O||O(e),M&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),T&&(N||!z)&&b(T,B,U,{locale:E,priority:!0,bypassPrefetchedCheck:!0},{kind:L},z)}};if((0,u.isAbsoluteUrl)(U))W.href=U;else if(!M||x||"a"===n.type&&!("href"in n.props)){let e=void 0!==E?E:null==k?void 0:k.locale,t=(null==k?void 0:k.isLocaleDomain)&&(0,g.getDomainLocale)(U,e,null==k?void 0:k.locales,null==k?void 0:k.domainLocales);W.href=t||(0,h.addBasePath)((0,c.addLocale)(U,e,null==k?void 0:k.defaultLocale))}return M?i.default.cloneElement(n,W):(0,o.jsx)("a",{...R,...W,children:r})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2905:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return s}});let n=r(7294),o=r(3815),i="function"==typeof IntersectionObserver,a=new Map,l=[];function s(e){let{rootRef:t,rootMargin:r,disabled:s}=e,u=s||!i,[c,f]=(0,n.useState)(!1),d=(0,n.useRef)(null),p=(0,n.useCallback)(e=>{d.current=e},[]);return(0,n.useEffect)(()=>{if(i){if(u||c)return;let e=d.current;if(e&&e.tagName)return function(e,t,r){let{id:n,observer:o,elements:i}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=l.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=a.get(n)))return t;let o=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=o.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:o},l.push(r),a.set(r,t),t}(r);return i.set(e,t),o.observe(e),function(){if(i.delete(e),o.unobserve(e),0===i.size){o.disconnect(),a.delete(n);let e=l.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&l.splice(e,1)}}}(e,e=>e&&f(e),{root:null==t?void 0:t.current,rootMargin:r})}else if(!c){let e=(0,o.requestIdleCallback)(()=>f(!0));return()=>(0,o.cancelIdleCallback)(e)}},[u,r,t,c,d.current]),[p,c,(0,n.useCallback)(()=>{f(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7367:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImgProps",{enumerable:!0,get:function(){return l}}),r(1997);let n=r(9919),o=r(7903);function i(e){return void 0!==e.default}function a(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function l(e,t){var r;let l,s,u,{src:c,sizes:f,unoptimized:d=!1,priority:p=!1,loading:g,className:h,quality:m,width:v,height:b,fill:j=!1,style:y,overrideSrc:_,onLoad:x,onLoadingComplete:w,placeholder:C="empty",blurDataURL:A,fetchPriority:E,layout:P,objectFit:S,objectPosition:O,lazyBoundary:M,lazyRoot:R,...k}=e,{imgConf:I,showAltText:T,blurComplete:z,defaultLoader:N}=t,L=I||o.imageConfigDefault;if("allSizes"in L)l=L;else{let e=[...L.deviceSizes,...L.imageSizes].sort((e,t)=>e-t),t=L.deviceSizes.sort((e,t)=>e-t);l={...L,allSizes:e,deviceSizes:t}}if(void 0===N)throw Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config");let B=k.loader||N;delete k.loader,delete k.srcSet;let U="__next_img_default"in B;if(U){if("custom"===l.loader)throw Error('Image with src "'+c+'" is missing "loader" prop.\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader')}else{let e=B;B=t=>{let{config:r,...n}=t;return e(n)}}if(P){"fill"===P&&(j=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[P];e&&(y={...y,...e});let t={responsive:"100vw",fill:"100vw"}[P];t&&!f&&(f=t)}let F="",D=a(v),H=a(b);if("object"==typeof(r=c)&&(i(r)||void 0!==r.src)){let e=i(c)?c.default:c;if(!e.src)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received "+JSON.stringify(e));if(!e.height||!e.width)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received "+JSON.stringify(e));if(s=e.blurWidth,u=e.blurHeight,A=A||e.blurDataURL,F=e.src,!j){if(D||H){if(D&&!H){let t=D/e.width;H=Math.round(e.height*t)}else if(!D&&H){let t=H/e.height;D=Math.round(e.width*t)}}else D=e.width,H=e.height}}let G=!p&&("lazy"===g||void 0===g);(!(c="string"==typeof c?c:F)||c.startsWith("data:")||c.startsWith("blob:"))&&(d=!0,G=!1),l.unoptimized&&(d=!0),U&&c.endsWith(".svg")&&!l.dangerouslyAllowSVG&&(d=!0),p&&(E="high");let K=a(m),J=Object.assign(j?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:S,objectPosition:O}:{},T?{}:{color:"transparent"},y),V=z||"empty"===C?null:"blur"===C?'url("data:image/svg+xml;charset=utf-8,'+(0,n.getImageBlurSvg)({widthInt:D,heightInt:H,blurWidth:s,blurHeight:u,blurDataURL:A||"",objectFit:J.objectFit})+'")':'url("'+C+'")',W=V?{backgroundSize:J.objectFit||"cover",backgroundPosition:J.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:V}:{},Y=function(e){let{config:t,src:r,unoptimized:n,width:o,quality:i,sizes:a,loader:l}=e;if(n)return{src:r,srcSet:void 0,sizes:void 0};let{widths:s,kind:u}=function(e,t,r){let{deviceSizes:n,allSizes:o}=e;if(r){let e=/(^|\s)(1?\d?\d)vw/g,t=[];for(let n;n=e.exec(r);n)t.push(parseInt(n[2]));if(t.length){let e=.01*Math.min(...t);return{widths:o.filter(t=>t>=n[0]*e),kind:"w"}}return{widths:o,kind:"w"}}return"number"!=typeof t?{widths:n,kind:"w"}:{widths:[...new Set([t,2*t].map(e=>o.find(t=>t>=e)||o[o.length-1]))],kind:"x"}}(t,o,a),c=s.length-1;return{sizes:a||"w"!==u?a:"100vw",srcSet:s.map((e,n)=>l({config:t,src:r,quality:i,width:e})+" "+("w"===u?e:n+1)+u).join(", "),src:l({config:t,src:r,quality:i,width:s[c]})}}({config:l,src:c,unoptimized:d,width:D,quality:K,sizes:f,loader:B});return{props:{...k,loading:G?"lazy":g,fetchPriority:E,width:D,height:H,decoding:"async",className:h,style:{...J,...W},sizes:Y.sizes,srcSet:Y.srcSet,src:_||Y.src},meta:{unoptimized:d,priority:p,placeholder:C,fill:j}}}},9919:function(e,t){"use strict";function r(e){let{widthInt:t,heightInt:r,blurWidth:n,blurHeight:o,blurDataURL:i,objectFit:a}=e,l=n?40*n:t,s=o?40*o:r,u=l&&s?"viewBox='0 0 "+l+" "+s+"'":"";return"%3Csvg xmlns='http://www.w3.org/2000/svg' "+u+"%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='"+(u?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none")+"' style='filter: url(%23b);' href='"+i+"'/%3E%3C/svg%3E"}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},5666:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return s},getImageProps:function(){return l}});let n=r(8754),o=r(7367),i=r(6541),a=n._(r(6663));function l(e){let{props:t}=(0,o.getImgProps)(e,{defaultLoader:a.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/calculadora-lajes/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let s=i.Image},6663:function(e,t){"use strict";function r(e){let{config:t,src:r,width:n,quality:o}=e;return t.path+"?url="+encodeURIComponent(r)+"&w="+n+"&q="+(o||75)}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return n}}),r.__next_img_default=!0;let n=r},3126:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return m}});var n=r(5893);r(1784);var o=r(1664),i=r.n(o),a=r(2972),l=r.n(a),s=r(5675),u=r.n(s),c=r(2345),f=r(1163);function d(e){let{ButtonContent:t,showButton:r,buttonEvent:o}=e;return(0,f.useRouter)(),(0,n.jsxs)("nav",{className:l().navContainer,children:[(0,n.jsx)(i(),{href:"/",children:(0,n.jsx)(u(),{src:c.Z,width:131,height:37,alt:"logo_iglu_me",className:l().logo})}),(0,n.jsx)("div",{children:r&&(0,n.jsx)("button",{className:l().actionButton,onClick:o,children:t})})]})}var p=r(9008),g=r.n(p),h=r(7294);function m(e){let{Component:t,pageProps:r}=e,[o,i]=(0,h.useState)(!0),a=t.navbarProps||{showButton:!1};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(g(),{children:[(0,n.jsx)("meta",{charSet:"UTF-8"}),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,n.jsx)("meta",{name:"author",content:"Lajes IglueME"}),(0,n.jsx)("meta",{name:"robots",content:"index, follow, max-snippet:-1, max-image-preview:large"}),(0,n.jsx)("meta",{httpEquiv:"X-UA-Compatible",content:"IE=edge"}),(0,n.jsx)("title",{children:"Calculadora de Lajes Treli\xe7adas, Painel Maci\xe7o e Protendidas | Engenharia Estrutural"}),(0,n.jsx)("meta",{name:"description",content:"Ferramenta online para c\xe1lculo de lajes treli\xe7adas, Painel Maci\xe7o e Protendidas. Obtenha resultados precisos para projetos estruturais de forma r\xe1pida e f\xe1cil."}),(0,n.jsx)("meta",{name:"keywords",content:"c\xe1lculo de lajes, lajes treli\xe7adas, lajes protendidas, engenharia estrutural, dimensionamento de lajes, constru\xe7\xe3o civil, IglueME. Lajes, Calculo estrutural, Engenharia, Engenharia Civil"}),(0,n.jsx)("link",{rel:"canonical",href:"https://www.iglumelajes.com.br/calculadora-lajes/"}),(0,n.jsx)("meta",{property:"og:title",content:"Calculadora de Lajes Treli\xe7adas, Painel Maci\xe7o e Protendidas"}),(0,n.jsx)("meta",{property:"og:description",content:"Ferramenta online para c\xe1lculos estruturais de lajes treli\xe7adas, painel maci\xe7o e protendidas. Simples, r\xe1pido. confi\xe1vel e eficiente."}),(0,n.jsx)("meta",{property:"og:image",content:"/calculadora-lajes/logo1.png"}),(0,n.jsx)("meta",{property:"og:url",content:"/calculadora-lajes/"}),(0,n.jsx)("meta",{property:"og:type",content:"website"}),(0,n.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,n.jsx)("meta",{name:"twitter:title",content:"Calculadora de Lajes Treli\xe7adas, Painel Maci\xe7o e Protendidas"}),(0,n.jsx)("meta",{name:"twitter:description",content:"Calcule lajes treli\xe7adas, painel maci\xe7o e protendidas de forma r\xe1pida e confi\xe1vel."}),(0,n.jsx)("meta",{name:"twitter:image",content:"/calculadora-lajes/logo1.png"}),(0,n.jsx)("link",{rel:"icon",href:"/calculadora-lajes/favicon.ico",type:"image/x-icon"})]}),o&&(0,n.jsx)(d,{...a}),(0,n.jsx)(t,{...r,setShowNavbar:i})]})}},1784:function(){},2972:function(e){e.exports={navContainer:"navbar_navContainer__kMxvX",logoContainer:"navbar_logoContainer__FwqPK",actionButton:"navbar_actionButton__K1HfR"}},9008:function(e,t,r){e.exports=r(7828)},5675:function(e,t,r){e.exports=r(5666)},1664:function(e,t,r){e.exports=r(9577)},1163:function(e,t,r){e.exports=r(9090)}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(6840),t(9090)}),_N_E=e.O()}]);