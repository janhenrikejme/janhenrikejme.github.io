(function() {
    "use strict";
    var naReloadVersion = "1.0";

    var helpers = {
        detectMobile: function() {
            return !!(navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) || window.innerWidth < 686);
        },
        detectOperaMini: function() {
            return !!(navigator.userAgent.match(/Opera Mini/i) || Object.prototype.toString.call(window.operamini) === "[object OperaMini]");
        },
        createElement: function(tag, attrs) {
            if (!tag) throw new SyntaxError("element tag name not defined");
            var ele = document.createElement(tag),
                attrName, styleName;
            if (attrs)
                for (attrName in attrs) {
                    if (attrName === "style")
                        for (styleName in attrs.style) { ele.style[styleName] = attrs.style[styleName]; }
                    else
                        ele[attrName] = attrs[attrName];
                }
            return ele;
        },
        setElementHeight: function(el, height) {
            el.style.height = height + "px";
        },
        serializeUrl: function(params) {
            var array = [];
            for (var key in params) {
                array.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
            }
            return array.join('&');
        }
    };

    var domHelper = {
        setProfileIFrameStyles: function(frameId, iframeWidth) {
            var cssStyles = "\
                #" + frameId + " {\
                    height: 0px;\
                    -moz-transition: height 0.25s ease;\
                    -ms-transition: height 0.25s ease;\
                    -webkit-transition: height 0.25s ease;\
                    transition: height 0.25s ease;\
                }\
                .nacomments-profile-iframe {\
                    -moz-transform: translateX(" + iframeWidth + "px) scale(0.95);\
                    -ms-transform: translateX(" + iframeWidth + "px) scale(0.95);\
                    -webkit-transform: translateX(" + iframeWidth + "px) scale(0.95);\
                    transform: translateX(" + iframeWidth + "px) scale(0.95);\
                    -moz-transition: ease-in-out 0.25s;\
                    -o-transition: ease-in-out 0.25s;\
                    -webkit-transition: ease-in-out 0.25s;\
                    transition: ease-in-out 0.25s;\
                }\
                .nacomments-profile-iframe.show {\
                    -moz-transform: translateX(0) scale(1);\
                    -ms-transform: translateX(0) scale(1);\
                    -webkit-transform: translateX(0) scale(1);\
                    transform: translateX(0) scale(1);\
                }";
            var styleEle = helpers.createElement("style");
            styleEle.innerHTML = cssStyles;
            document.getElementsByTagName('head')[0].appendChild(styleEle);
        },

        createNaCommentFrame: function(frameId) {
            var elementProperties = {
                id: frameId,
                title: "Kommentarfelt for artikkelen.",
                scrolling: "no",
                frameborder: "0",
                width: "100%",
                style: {
                    border: "none",
                    maxWidth: "100%",
                    position: "relative",
                    overflow: "auto",
                    height: "220px"
                }
            };
            return helpers.createElement("iframe", elementProperties);
        },

        createNaCloakElement: function() {
            var elementProperties = {
                className: "nacomments-profile-cloak",
                style: {
                    position: "fixed",
                    right: 0,
                    top: 0,
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: "100000",
                    display: "none"
                }
            };
            return helpers.createElement("aside", elementProperties);
        },

        createNaProfileFrame: function() {
            var elementProperties = {
                className: "nacomments-profile-iframe",
                style: {
                    position: "fixed",
                    top: "0",
                    right: "0",
                    height: "100%",
                    border: "none",
                    backgroundColor: "white",
                    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                    zIndex: "100001"
                }
            };
            return helpers.createElement("iframe", elementProperties);
        }
    };

    var srcHelper = {
        urlCommonization: function(url) {
            return url.replace(/https?:/, '');
        },
        getUrlQueryParams: function(obj) {
            for (var prop in obj) {
                if (!obj[prop]) {
                    delete obj[prop];
                }
            }
            return helpers.serializeUrl(obj);
        },
        getAttributes: function() {
            var attributes = {};
            if (location.hash) {
                var hashSplit = location.hash.split("/");
                var splitData;

                for (var x = 0; x < hashSplit.length; x++) {
                    if (hashSplit[x].indexOf("replycomment-") > -1) {
                        splitData = hashSplit[x].split("replycomment-");
                        attributes.replyComment = splitData[1];
                    } else if (hashSplit[x].indexOf("custom-") > -1) {
                        splitData = hashSplit[x].split("custom-");
                        attributes.custom = splitData[1];
                    }
                };
                return attributes;
            } else {
                return false;
            }
        },
        getIFrameSrc: function(type, data) {
            var src = '';
            switch (type) {
                case 'profile':
                    src = serviceUrl + 'profile/?v=' + naReloadVersion + '#/' + data + '/fromComments?publication=' + naCommentsData.naCommentsPublication;
                    break;
                case 'loading':
                    src = serviceUrl + "comments/loading.html";
                    break;
                case 'comment':
                default:
                    src = serviceUrl + "comments/?v=" + naReloadVersion + "#/comment/?" + data;
            }
            return src;
        },
        getCommentFrameParams: function(commentsUrlQuery) {
            return commentsUrlQuery['url'] ? this.getUrlQueryParams(commentsUrlQuery) : '';
        }
    };

    var toggleProfileModal = function(close) {
        if (isMobile == undefined) return;
        if (!isMobile) {
            if (naCloakElement.style.display == 'block' || close) {
                naCloakElement.style.display = 'none';
                naProfileFrame.classList.remove('show');
                naBody.style.overflow = 'auto';
            } else {
                naCloakElement.style.display = 'block';
                naProfileFrame.classList.add('show');
                naBody.style.overflow = 'hidden';
            }
        } else if (close) {
            naCommentFrame.contentWindow.postMessage(['closeDialog', ""], '*');
        }
    };

    var isMobile = undefined,
        naCommentSelectorID = "na-comments",
        naCommentsNode = document.getElementById(naCommentSelectorID);

    if (!naCommentsNode) {
        console.log(naCommentSelectorID + ' id not found');
        return;
    }

    var naCommentsData = naCommentsNode.dataset,
        serviceUrl = !naCommentsData.naTest ? "https://" + naCommentsData.naCommentsPublication + "/api/amediacomments/frontend/nacomment/comments-frontend/" : "/api/amediacomments/frontend/nacomment/comments-frontend/";

    var naCommentFrame = domHelper.createNaCommentFrame(naCommentSelectorID);

    var naCloakElement = domHelper.createNaCloakElement();
    naCloakElement.addEventListener('click', function() {
        toggleProfileModal();
    });

    var profileIframeWidth = 420;
    if (window.innerWidth < profileIframeWidth) {
        profileIframeWidth = window.innerWidth;
    }

    var naProfileFrame = domHelper.createNaProfileFrame();
    naProfileFrame.style.width = profileIframeWidth + 'px';

    var naBody = document.getElementsByTagName('body')[0];

    var readyToLoad = function() {
        if (!naCommentsNode.parentNode) { return; }

        var naAttributes = srcHelper.getAttributes();
        var hasPublicationAttribute = true;
        if(!naCommentsData.naCommentsPublication) {
            naCommentsData.naCommentsPublication = "www.nettavisen.no";
            hasPublicationAttribute = false;
        }
        if(!naCommentsData.naCommentsScope && hasPublicationAttribute) {
            naCommentsData.naCommentsScope = naCommentsData.naCommentsPublication
        } else if (!naCommentsData.naCommentsScope && !hasPublicationAttribute) {
            naCommentsData.naCommentsScope = "Nettavisen";
        }


        var naCommentFrameSrc = srcHelper.getIFrameSrc('comment', srcHelper.getCommentFrameParams({
            'url': srcHelper.urlCommonization(naAttributes.custom || naCommentsData.naCommentsUrl || window.location.href.split("#/")[0]),
            'replycomment': naAttributes.replyComment,
            'scope': naCommentsData.naCommentsScope,
            'publication': naCommentsData.naCommentsPublication,
            'editable': naCommentsData.naCommentsEditable,
            'from': naCommentsData.naCommentsFrom,
            'to': naCommentsData.naCommentsTo,
            'publishedOn': naCommentsData.naCommentsPublishedOn,
            'header': naCommentsData.naCommentsHeader,
            'aid': naCommentsData.naAid,
            'nagging': naCommentsData.naNagging,
            'test' : naCommentsData.naTest
        }));

        naCommentsNode.parentNode.replaceChild(naCommentFrame, naCommentsNode);
        domHelper.setProfileIFrameStyles(naCommentSelectorID, profileIframeWidth);

        var observer = new IntersectionObserver(function (entries) {
            if (entries.length > 0 && entries[0].isIntersecting) {
                console.log('Loading amedia comments');
                naCommentFrame.src = naCommentFrameSrc;
                observer.unobserve(naCommentFrame);
            }
        }, {
            rootMargin: '400px',
        });

        observer.observe(naCommentFrame);

        // Listen to message from child window
        window.addEventListener("message", function(event) {
            var msg = event.data;
            switch (msg[0]) {
                case "isMobile":
                    isMobile = msg[1];
                    if (!isMobile) {
                        naBody.appendChild(naCloakElement);
                        naBody.appendChild(naProfileFrame);
                    }
                    break;
                case "setHeight":
                    helpers.setElementHeight(naCommentFrame, msg[1]);
                    break;
                case "setOffset":
                    naBody.scrollTop = naCommentFrame.offsetTop + msg[1];
                    setTimeout(function() {
                        naBody.scrollTop = naCommentFrame.offsetTop + msg[1];
                    }, 2000);
                    break;
                case "openProfile":
                    var naProfileSrc = srcHelper.getIFrameSrc('profile', msg[1]);
                    if (!naProfileFrame.src) {
                        naProfileFrame.src = naProfileSrc;
                    } else {
                        naProfileFrame.contentWindow.location.replace(naProfileSrc);
                    }
                    toggleProfileModal();
                    break;
                case "updateAuth":
                    naCommentFrame.contentWindow.postMessage(['updateAuth', ""], '*');
                    break;
                case "closeDialog":
                    toggleProfileModal(true);
                    break;
            }
        }, false);
    };

    window.addEventListener("DOMContentLoaded", readyToLoad, false);
    window.addEventListener("load", readyToLoad, false);
})();