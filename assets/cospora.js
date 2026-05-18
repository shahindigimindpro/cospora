(function ($) {
    var body = $('body'),
        doc = $(document),
        html = $('html'),
        win = $(window),
        wrapperOverlaySlt = '.wrapper-overlay',
        iconNav,
        dropdownCart,
        miniProductList;   

    var wishListsArr = localStorage.getItem('wishListsArr') ? JSON.parse(localStorage.getItem('wishListsArr')) : [];
    var compareArr = localStorage.getItem('compareArr') ? JSON.parse(localStorage.getItem('compareArr')) : [];

    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
    localStorage.setItem('compareArr', JSON.stringify(compareArr));
    
    if (wishListsArr.length) {
        wishListsArr = JSON.parse(localStorage.getItem('wishListsArr'));
    }; 

    if (compareArr.length) {
        compareArr = JSON.parse(localStorage.getItem('compareArr'));
    }; 
    
    doc.ready(function () {
        iconNav = $('[data-menu-mb-toogle]'),
        dropdownCart = $('#dropdown-cart'),
        miniProductList = dropdownCart.find('.mini-products-list');

        doc.ajaxStart(function () {
            cospora.isAjaxLoading = true;
        });

        doc.ajaxStop(function () {
            cospora.isAjaxLoading = false;
        });

        cospora.init();

        doc
            .on('shopify:section:load', cospora.initSlideshow)
            .on('shopify:section:unload', cospora.initSlideshow)

            .on( 'shopify:section:load', cospora.SlicksliderHP )
            .on( 'shopify:section:unload', cospora.SlicksliderHP)

            .on('shopify:section:load', cospora.initSliderFeaturedProducts)
            .on('shopify:section:unload', cospora.initSliderFeaturedProducts)

            .on('shopify:section:load', cospora.initBrandsSlider)
            .on('shopify:section:unload', cospora.initBrandsSlider)
    });

    var winWidth = win.innerWidth();   
   
    win.off('resize.initMenuMobile').on('resize.initMenuMobile', function() {
        var resizeTimerId;

        clearTimeout(resizeTimerId);

        resizeTimerId = setTimeout(function() {
            var curWinWidth = win.innerWidth();

            if ((curWinWidth < 1200 && winWidth >= 1200) || (curWinWidth >= 1200 && winWidth < 1200)) {
                cospora.showHideMenuMobile();
                cospora.initToggleMuiltiLangCurrency();
                cospora.addTextMuiltiOptionActive($('.lang-switcher'), $('.lang-switcher [data-value].active'), $('[data-language-label]'));
                cospora.addTextMuiltiOptionActive($('.currencies'), $('.currencies [data-currency].active'), $('[data-currency-label]'));
                cospora.initDropdownColFooter();
                cospora.dropdownCart();
                cospora.dropdownCustomer();
                cospora.appendMenuMobile();
                cospora.appendLanguageMobile();
                cospora.stickyFixedTopMenu();
            };
            winWidth = curWinWidth;
        }, 0);
    });

    win.on('resize', function () {
        cospora.setActiveViewModeMediaQuery();
    });

    var cospora = {
        cosporaTimeout: null,
        isSidebarAjaxClick: false,
        isAjaxLoading: false,
        init: function () {
            this.closeHeaderTop();
            this.cookie_popup();
            this.showHideMenuMobile();
            this.closeAllOnMobile();
            this.initToggleMuiltiLangCurrency();
            this.addTextMuiltiOptionActive($('.lang-switcher'), $('.lang-switcher [data-value].active'), $('[data-language-label]'));
            this.addTextMuiltiOptionActive($('.currencies'), $('.currencies [data-currency].active'), $('[data-currency-label]'));
            this.initDropdownColFooter();
            this.initScrollTop();
            this.dropdownCart();
            this.initColorSwatchGrid();
            this.appendMenuMobile();
            this.appendLanguageMobile();
            this.dropdownCustomer();
            this.initDropdownSearchMobile();
            
            
            this.initCloseRightPopup();
            this.initNewsLetterPopup();
            this.addEventShowOptions();
            this.changeQuantityAddToCart();
            this.initAddToCart();
            this.initSliderFeaturedProducts();
            this.closeModal();

            this.addEventLookbookModal();
            this.initCountdown();
            this.initCountdownNormal();

            this.SlicksliderHP();

            this.sliderMegaMenu();
            this.initBrandsSlider();
            this.checkbox_checkout();
            this.changeSelectValue();
            
            if(body.hasClass('template-index') || body.hasClass('template-page')) {
                this.initSlideshow();
            };

            if(body.hasClass('template-index')) {
                this.initInfiniteScrollingHomepage();
                this.clickedActiveProductTabs();
                this.initBlogPostSlider();
                this.initTrendingSlider();
            }

            if(body.hasClass('template-list-collections')) {
                this.initCollectionPagging();
            }

            if(body.hasClass('template-collection') || body.hasClass('template-search')) {
                this.initInfiniteScrolling();
                this.initPaginationPage();
                this.initCompareIcons();
                this.doAddOrRemoveCompare();
                this.initCompareSelected();
                this.hide_filter();
            }            

            if(body.hasClass('template-collection')) {               
                this.filterToolbar();
                this.filterSidebar();
            }

            if(body.hasClass('template-')){
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
            }

            this.InitsidebarFilter();
            this.initSidebar();
            this.initProductMoreview($('[data-more-view-product] .product-img-box'));
            this.initSoldOutProductShop();
            this.initCustomerViewProductShop();                       
            this.initChangeQuantityButtonEvent();
            this.initQuantityInputChangeEvent();
            this.changeQuantityDropdownCart();
            
            this.removeCartItem();
            this.initZoom();

            this.initQuickView();
            this.openSearchForm();
            this.stickyFixedTopMenu();
            this.initDropdownMenu();

            if(body.hasClass('template-product') ) {
                this.changeSwatch('#add-to-cart-form .swatch :radio');
                this.productPageInitProductTabs();
                this.initStickyAddToCart();
                this.slideLookbookProducts();
                this.initGroupSlider();
                if($('.frequently-bought-together-block').length > 0){
                    this.initBundleProducts();
                }
                this.productRecomendation();
                this.appendProductRecomendation();
            }

            if($('.template-cart').length) {
                this.initCartQty();
                this.initUpdateCart();
             };

            this.initWishListIcons();
            this.doAddOrRemoveWishlish();

            if(body.hasClass('template-page') && $('.wishlist-page').length) {
                this.initWishLists();           
            };
        },
        cookie_popup: function() {
          // $('#accept-cookies').show();
          // if ($.cookie('cookieMessage') == 'closed') {
          //   $('#accept-cookies').remove();
          // }

          // $('#accept-cookies .btn-accept').bind('click',function(){
          //   $('#accept-cookies').remove();
          //   $.cookie('cookieMessage', 'closed', {expires:1, path:'/'});
          // });

          // $('#accept-cookies .close-window').click(function(event) {
          //    $('#accept-cookies').remove();
          // });

        }, 
        showHideMenuMobile: function () {
            if (iconNav.length && iconNav.is(':visible')) {
                iconNav.off('click.showMenuMobile').on('click.showMenuMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.toggleClass('translate-overlay');
                    $('.close-menu-mb').toggleClass('menu-open');

                    $('.main-menu.jas-mb-style').css({
                        "overflow": ""
                    });
                    $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
                })
            };
        },
        closeAllOnMobile: function () {
            body.off('click.close', wrapperOverlaySlt).on('click.close', wrapperOverlaySlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.removeClass('translate-overlay cart-show customer-show search-show sidebar-open options-show');
                $('.close-menu-mb').removeClass('menu-open');

                $('.main-menu.jas-mb-style').css({
                    "overflow": ""
                });
                $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
            });
        },
        initToggleMuiltiLangCurrency: function () {
            var langCurrencyGroups = $('.lang-currency-groups'),
                dropdownGroup = langCurrencyGroups.find('.btn-group'),
                dropdownLabel = dropdownGroup.find('.dropdown-label');

            if (dropdownLabel.length && dropdownLabel.is(':visible')) {
                dropdownLabel.off('click.toggleMuiltiOption').on('click.toggleMuiltiOption', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var selfNextDropdown = $(this).next();

                    if (!selfNextDropdown.is(':visible')) {
                        dropdownLabel.next('.dropdown-menu').hide();
                        selfNextDropdown.slideDown(300);
                    } else {
                        selfNextDropdown.slideUp(300);
                    }
                });

                cospora.hideMuiltiLangCurrency();
            } else {
                dropdownLabel.next('.dropdown-menu').css({
                    'display': ''
                });
            };
        },

        closeHeaderTop: function () {
            var headerTopEml = $('.header-top'),
                closeHeaderTopElm = headerTopEml.find('[data-close-header-top]');

            if (closeHeaderTopElm.length && closeHeaderTopElm.is(':visible')) {
                if ($.cookie('headerTop') == 'closed') {
                    headerTopEml.remove();

                };

                closeHeaderTopElm.off('click.closeHeaderTop').on('click.closeHeaderTop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    headerTopEml.remove();
                    $.cookie('headerTop', 'closed', {
                        expires: 1,
                        path: '/'
                    });
                });
            };
        },

        hideMuiltiLangCurrency: function () {
            doc.off('click.hideMuiltiLangCurrency').on('click.hideMuiltiLangCurrency', function (e) {
                var muiltiDropdown = $('.lang-currency-groups .dropdown-menu');

                if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
                    muiltiDropdown.slideUp(300);
                }
            });
        },

        addTextMuiltiOptionActive: function (SltId, dataSlt, label) {
            if (label.length && label.is(':visible')) {
                var item = dataSlt.html();

                SltId.prev(label).html(item);
            };
        },

        initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');                

            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this),
                        auto_playvideo = self.data('auto-video');

                    if(auto_playvideo) {   
                        // POST commands to YouTube or Vimeo API
                        function postMessageToPlayer(player, command) {
                            if (player == null || command == null) return;
                            player.contentWindow.postMessage(JSON.stringify(command), "*");
                        }

                        // When the slide is changing
                        function playPauseVideo(slick, control) {
                            var currentSlide, player, video;

                            currentSlide = slick.find('.slick-active .slide-youtube');
                            player = currentSlide.find("iframe").get(0);

                            if (currentSlide.hasClass('slide-youtube')) {                                          
                                switch (control) {
                                    case "play":                                   
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "mute"
                                        });
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "playVideo"
                                        });
                                        break;

                                    case "pause":
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "pauseVideo"
                                        });
                                        break;
                                }

                            } else if (currentSlide.hasClass('slide-video')) {
                                video = currentSlide.children("video").get(0);

                                if (video != null) {
                                    if (control === "play"){
                                        video.play();
                                    } else {
                                        video.pause();
                                    }
                                }
                            };
                        };

                        self.on('init', function(slick) {
                            slick = $(slick.currentTarget);

                            setTimeout(function(){
                                playPauseVideo(slick,"play");
                            }, 1000);
                        });

                        self.on("beforeChange", function(event, slick) {
                            slick = $(slick.$slider);                           
                            playPauseVideo(slick,"pause");
                        });

                        self.on("afterChange", function(event, slick) {
                            slick = $(slick.$slider);                            
                            playPauseVideo(slick,"play");
                        });
                    };

                    if (self.not('.slick-initialized')) {
                        self.slick({
                            dots: self.data('dots'),
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplaySpeed'),
                            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                    arrows: false,
                                    dots: self.data('dots'),
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    autoplay: true,
                                    dots: true
                                }
                            }
                            ]
                        });
                    };
                });
            };
        },

        Slickslider: function(dataslick, infinite, row, rowlt, rowtb, rowtblg, rowbm, arrows, dots, auto, fade, arrowsmb, dotsmb){
            dataslick.not('.slick-initialized').slick({
                infinite: infinite,
                slidesToShow: row,
                slidesToScroll: 1,
                arrows: arrows,
                dots: dots,
                fade: fade,
                autoplay:auto,
                autoplaySpeed: 5000,
                nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                speed : 500,  
                responsive: [
                   {
                    breakpoint: 1450,
                    settings: {
                      slidesToShow: rowlt,
                      slidesToScroll: 1,
                      dots: dots,
                      arrows: arrows,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 1281,
                    settings: {
                      slidesToShow: rowtb,
                      slidesToScroll: 1,
                      dots: dots,
                      arrows: arrows,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 1025,
                    settings: {
                      slidesToShow: rowtb,
                      slidesToScroll: rowtb,
                      dots: dotsmb,
                      arrows: arrowsmb,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 992,
                    settings: {
                      slidesToShow: rowtblg,
                      slidesToScroll: rowtblg,
                      dots: dotsmb,
                      arrows: arrowsmb,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: rowbm,
                      slidesToScroll: rowbm,
                      dots: dotsmb,
                      arrows: arrowsmb,
                      autoplay:auto,
                    }
                  },
                  {
                    breakpoint: 370,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      dots: dotsmb,
                      arrows:arrowsmb,
                      autoplay:auto,
                    }
                  }
                ]
            });
        },

        SlicksliderHP: function() {
              $('.has-slick').each(function(){
                var slick = $(this),
                    row = $(this).data('row'),
                    rowlt = $(this).data('rowlt'),
                    rowtb = $(this).data('rowtb'),
                    rowtblg = $(this).data('rowtblg'),
                    rowbm = $(this).data('rowbm'),
                    infinite = $(this).data('infinite');

                if($(this).hasClass('has-dots')){
                  var dots = true;
                }
                
                if($(this).hasClass('not-arrows')){
                  var arrows = false,
                      dots = true,
                      auto = false,
                      fade = $(this).data('fade');
                }
                else if ($(this).hasClass('has-dots')) {
                    var arrows = true,
                      dots = true,
                      auto = false,
                      fade = false;
                }
                else {
                  var arrows = true,
                      dots = false,
                      auto = false,
                      fade = false;
                }

                if($(this).hasClass('has-arrows')){

                  var arrowsmb = false,
                      dotsmb= true;

                } else{
                  var arrowsmb= false,
                      dotsmb= true;
                }

                cospora.Slickslider(slick, infinite, row, rowlt, rowtb, rowtblg, rowbm, arrows, dots, auto, fade, arrowsmb, dotsmb);
              });
        },

        initInfiniteScrollingHomepage: function () {
            var newArrivalsProduct = $('[data-new-arrivals-product]');

            newArrivalsProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    productsToShow = productGrid.data('products-to-show'),
                    showMorebtn = self.find('.infinite-scrolling-homepage a'),
                    noMoreText = window.inventory_text.no_more_product;

                if (productGrid.find('.grid-item:hidden').length) {
                    showMorebtn.off('click.showMoreProduct').on('click.showMoreProduct', function (e) {
                        e.preventDefault();

                        if (productGrid.find('.grid-item:hidden').length > 0) {
                            productGrid.find('.grid-item:hidden:lt(' + productsToShow + ')').each(function () {
                                $(this).show();
                            });

                            win.scroll();
                        };

                        if (!productGrid.find('.grid-item:hidden').length) {
                            if (window.multi_lang && translator.isLang2())
                                noMoreText = window.lang2.collections.general.no_more_product;
                            showMorebtn.html(noMoreText).addClass('disabled');
                        };

                    });
                } else {
                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;
                    showMorebtn.html(noMoreText).addClass('disabled');
                }
            });
        },

        initBrandsSlider: function () {
            this.brandsStyle();
        },

        brandsStyle: function() {
            var brandsSlider = $('[data-brands-slider]');

            brandsSlider.each(function () {
                var self = $(this);

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: self.data('rows'),
                        slidesToScroll: 1,
                        dots: false,
                        arrows: true,
                        infinite: false,
                        autoplay: false,
                        speed: 800,                        
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            });
        },

        initGroupSlider: function (){
            var slick = $(".group_content");

            slick.slick({
                slidesToScroll: 3,
                slidesToShow: 3,
                dots: false,
                infinite: false,
                nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                responsive: [{
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        },

        initDropdownColFooter: function () {
            var footerTitle = $('.site-footer .dropdow-mb');

            if (window.innerWidth < 768) {
                if (footerTitle.length) {
                    footerTitle.off('click.slideToggle').on('click.slideToggle', function () {
                        $(this).next().slideToggle();
                        $(this).toggleClass('open');
                    });
                }
            } else {
                footerTitle.next().css({
                    "display": ""
                });
            }
        },

        initScrollTop: function () {
            var backToTop = $('#back-top');

            win.scroll(function () {
                if ($(this).scrollTop() > 220) {
                    backToTop.fadeIn(400);
                } else {
                    backToTop.fadeOut(400);
                };
            });

            backToTop.off('click.scrollTop').on('click.scrollTop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('html, body').animate({
                    scrollTop: 0
                }, 400);
                return false;
            });
        },

        dropdownCustomer: function () {
            this.initDropdownMobileTranslate($('[data-user-mobile-toggle]'), 'customer-show');
            this.closeDropdownCustomerTranslate();
            this.appendCustomerForPCHeader();
            this.doDropdownCustomerPCHeader();
        },

        closeDropdownCustomerTranslate: function () {
            cospora.closeTranslate('#dropdown-customer .close-customer', 'customer-show');
        },

        appendCustomerForPCHeader: function () {
            var customerLink = $('.header-default .header-panel-bt .customer-links'),
                dropdowCustomer = $('#dropdown-customer');

            if (window.innerWidth >= 1200) {
                dropdowCustomer.appendTo(customerLink);
            } else {
                dropdowCustomer.appendTo(body);
            }
        },

        doDropdownCustomerPCHeader: function () {
            var customerLoginLink = $('[data-dropdown-user]');
            var dropdownUse = $('#dropdown-customer');

            if(window.innerWidth >= 1200) {
                customerLoginLink.off('click.toogleCustomer').on('click.toogleCustomer', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).siblings('#dropdown-customer').slideToggle();
                });

                dropdownUse.off('click.toogleCustomer').on('click.toogleCustomer', function (e) {
                    e.stopPropagation();
                }); 

                body.off('click.toogleCustomer').on('click.toogleCustomer', function (e) {
                      dropdownUse.slideUp();
                });
            }
        },

        initDropdownSearchMobile: function () {
            this.initDropdownMobileTranslate($('[data-search-toogle-mobile]'), 'search-show');
            this.closeTranslate('.search-form .close-search', 'search-open');
        },

        initDropdownMobileTranslate: function (iconMoblie, sltShowIconMoblie) {
            if (iconMoblie.length && iconMoblie.is(':visible')) {
                iconMoblie.off('click.dropdownMobile').on('click.dropdownMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.addClass(sltShowIconMoblie);
                });
            };
        },

        closeTranslate: function (closeElm, classRemove) {
            if ($(closeElm).length) {
                body.off('click.closedropdownMobile', closeElm).on('click.closedropdownMobile', closeElm, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.removeClass(classRemove);
                });


            };

            body.off("click.closeSidebar").on("click.closeSidebar", function(e){
                 
                // console.log($(e.target).parents(".sidebar").length);
                if( html.hasClass('sidebar-open') && $(e.target).parents(".sidebar").length ){
                     return true;
                }
                else if (html.hasClass('sidebar-open') && $(e.target).parents(".sidebar-label").length == 0 ) {
                    
                    html.removeClass('sidebar-open');
                    
                }
            });
        },  
         
   
        initCloseRightPopup: function () {
            var dropdownRightNav = '#right-nav-dropdown';
            var dropdownSearch = '.search-form';
            var dropdownCart = '#dropdown-cart';
            var iconMenu = $('[data-dropdown-menu]');

            doc.off('click.closeRightPopup').on('click.closeRightPopup', function(e) {   

                if ((!$(e.target).closest(dropdownRightNav).length && $('#right-nav-dropdown').hasClass('menu-open')) || (!$(e.target).closest(dropdownCart).length && $('#dropdown-cart').hasClass('menu-open')) || (!$(e.target).closest(dropdownSearch).length && $('.search-form').hasClass('menu-open'))) {
                    $('#right-nav-dropdown').removeClass('menu-open');
                    $('.search-form').removeClass('menu-open');
                    $('#dropdown-cart').removeClass('menu-open');

                    iconMenu.removeClass('menu-open');
                    body.removeClass('has-right-popup');
                }
            });
        },
        dropdownCart: function () {           
            this.closeDropdownCartTranslate();
            this.initDropdownCartMobile();
            this.initDropdownCartDesktop();
            this.checkItemsInDropdownCart();
            this.removeItemDropdownCart();
        },

        appendDropdownCartForMobile: function () {
            var wrapperTopCart = $('.wrapper-top-cart');

            if (window.innerWidth < 1200) {
                dropdownCart.appendTo(body);
            } else {
                dropdownCart.appendTo(wrapperTopCart);
            }
        },

        initDropdownMenu: function() {
            $(".nav-bar .site-nav .item.dropdown").on("mouseover", function(t) {
                $(".wrapper-navigation").addClass("overlay-open")
            }), $(".nav-bar .site-nav .item.dropdown").on("mouseleave", function(t) {
                $(".wrapper-navigation").removeClass("overlay-open")
            })
        },

        initDropdownCartForHeaderDefault: function () {
            var wrapperTopCart = $('.wrapper-top-cart'),
                cartIcon = wrapperTopCart.find('[data-cart-toggle]');

            if (cartIcon.length && cartIcon.is(':visible')) {
                if (window.dropdowncart_type == 'click') {
                    cartIcon.off('click.toogleDropdownCart').on('click.toogleDropdownCart', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        wrapperTopCart.toggleClass('is-open');
                        dropdownCart.slideToggle();
                    });
                } else {
                    cartIcon.hover(function () {
                        var customer = $('#dropdown-customer');

                        if (customer.is(':visible')) {
                            customer.hide();
                        };

                        if (!wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.addClass('is-open');
                            dropdownCart.slideDown();
                        }
                    });

                    wrapperTopCart.mouseleave(function () {
                        if (wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.removeClass('is-open');
                            dropdownCart.slideUp();
                        };
                    });
                }
            } else {
                dropdownCart.css("display", "");
            }
        },

        closeDropdownCartTranslate: function () {
            cospora.closeTranslate('#dropdown-cart .close-cart', 'cart-show');
        },

        initDropdownCartMobile: function () {
            var headerMb = $('.header-mb, [data-cart-header-parallax], [data-cart-header-02], [data-cart-header-04], [data-cart-header-supermarket]'),
                cartIcon = headerMb.find('[data-cart-toggle]');

            cartIcon.off('click.initDropdownCartMobile').on('click.initDropdownCartMobile', function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('cart-show');
                cospora.initFreeShippingMessage();
            });
        },

        initDropdownCartDesktop: function () {
            cospora.appendDropdownCartForMobile();
            cospora.initDropdownCartForHeaderDefault();
        },

        addEventShowOptions: function() {
            var optionsIconSlt = '[data-show-options]';

            doc.off('click.showOptions', optionsIconSlt).on('click.showOptions', optionsIconSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('options-show');
            });

            cospora.closeTranslate('.lang-currency-groups .close-option', 'options-show');
        },

        checkItemsInDropdownCart: function () {
            var cartNoItems = dropdownCart.find('.no-items'),
                cartHasItems = dropdownCart.find('.has-items');

            if (miniProductList.children().length) {
                cartHasItems.show();
                cartNoItems.hide();
            } else {
                cartHasItems.hide();
                cartNoItems.show();
            };
        },

        removeItemDropdownCart: function (cart) {
            var btnRemove = dropdownCart.find('.btn-remove');

            btnRemove.off('click.removeCartItem').on('click.removeCartItem', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                Shopify.removeItem(productId, function (cart) {
                    cospora.doUpdateDropdownCart(cart);
                    cospora.initFreeShippingMessage();
                });
            });
        },

        updateDropdownCart: function () {
            Shopify.getCart(function (cart) {
                cospora.doUpdateDropdownCart(cart);
            });
        },

        doUpdateDropdownCart: function (cart) {
            var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg></a><a class="product-name" href="{URL}">{TITLE}</a><div class="option"><small>{VARIANT}</small></div><div class="cart-collateral"><span class="qtt">{QUANTITY} X </span><span class="price">{PRICE}</span></div></div></li>';

            $('[data-cart-count]').text(cart.item_count);

            dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

            miniProductList.html('');

            if (cart.item_count > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = template;

                    item = item.replace(/\{ID\}/g, cart.items[i].id);
                    item = item.replace(/\{URL\}/g, cart.items[i].url);
                    item = item.replace(/\{TITLE\}/g, cospora.translateText(cart.items[i].product_title));
                    item = item.replace(/\{VARIANT\}/g, cart.items[i].variant_title || '');
                    item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
                    item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '160x'));
                    if (cart.cart_level_discount_applications.length > 0) {
                      item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].discounted_price, window.money_format));
                    } else {
                      item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));
                    }

                    miniProductList.append(item);
                }

                cospora.removeItemDropdownCart(cart);

                if (cospora.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#dropdown-cart span.money', 'money_format');
                }
            }

            cospora.checkItemsInDropdownCart();
        },

        translateText: function (str) {
            if (!window.multi_lang || str.indexOf("|") < 0)
                return str;

            if (window.multi_lang) {
                var textArr = str.split("|");

                if (translator.isLang2())
                    return textArr[1];
                return textArr[0];
            };
        },

        checkNeedToConvertCurrency: function () {
            return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
        },

        initColorSwatchGrid: function () {
            var itemSwatchSlt = '.item-swatch li label';

            body.off('click.toggleClass').on('click.toggleClass', itemSwatchSlt, function () {
                var self = $(this),
                    productItemElm = self.closest('.grid-item'),
                    sidebarWidgetProduct = productItemElm.closest('.sidebar-widget-product');

                $('.item-swatch li label').removeClass('active');
                self.addClass('active');

                var newImage = self.data('img');

                if (sidebarWidgetProduct.length) {
                    newImage = newImage.replace('600x', 'large');
                }

                if (newImage) {
                    productItemElm.find('.product-grid-image .images-one').attr({
                        src: newImage,
                        "data-src": newImage,
                        "srcset": newImage,
                    });

                    return false;
                }
            });
        },

        showLoading: function () {
            $('.loading-modal').show();
        },

        hideLoading: function () {
            $('.loading-modal').hide();
        },

        showModal: function (selector) {
            $(selector).fadeIn(500);
            var removeContent = $('[data-ajax-cart-success]').find('.cart-modal-content .item-bundle');

            cospora.cosporaTimeout = setTimeout(function () {
                $(selector).fadeOut(500);
                removeContent.remove();
            }, 5000);
        },

        closeModal: function() {
          $('.continue-shopping').click(function() {
            clearTimeout(cospora.cosporaTimeout);
            $('.add-ajax-success-modal').fadeOut(500);
          });
          $('.close-modal-ajax').click(function(e) {
            var removeContent = $('[data-ajax-cart-success]').find('.cart-modal-content .item-bundle');
            e.preventDefault();
            e.stopPropagation();
            setTimeout(function(){
              removeContent.remove();
            },500);
            clearTimeout(cospora.cosporaTimeout);
            $('.add-ajax-success-modal').fadeOut(500);
          });

        },

        translateBlock: function (blockSelector) {
            if (window.multi_lang && translator.isLang2()) {
                translator.doTranslate(blockSelector);
            }
        },

        closeLookbookModal: function () {
            $('.ajax-lookbook-modal').fadeOut(500);
        },

        addEventLookbookModal: function () {
            body.off('click.addEvenLookbookModal touchstart.addEvenLookbookModal', '[data-lookbook-icon]').on('click.addEvenLookbookModal touchstart.addEvenLookbookModal', '[data-lookbook-icon]', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var handle = $(this).data('handle'),
                    position = $(this);

                cospora.doAjaxAddLookbookModal(handle, position);

                doc.off('click.closeLookbookModal').on('click.closeLookbookModal', '[data-close-lookbook-modal], .ajax-lookbook-modal .overlay', function () {
                    cospora.closeLookbookModal();
                    return false;
                });
            });
        },

        doAjaxAddLookbookModal: function (handle, position) {
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = $('.ajax-lookbook-modal').innerWidth(),
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;


            if (window.innerWidth > 767) {
                if (left > (innerLookbookModal + 31)) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                }
                if (top > (innerLookbookModal + 31)) {
                    newtop = top - (innerLookbookModal / 2) + "px";
                } else {
                    newtop = top - 50 + "px";
                }
                
            } else {
                newleft = 0;
                newtop = top - 50 + "px";
            };

            if (cospora.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: window.router + '/products/' + handle + '?view=json',

                success: function (data) {
                    $('.ajax-lookbook-modal').css({
                        'left': newleft,
                        'top': newtop
                    });

                    $('.ajax-lookbook-modal .lookbook-content').html(data);

                    cospora.translateBlock('.lookbook-content');
                    $('.ajax-lookbook-modal').fadeIn(500);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);

                    cospora.showModal('.ajax-error-modal');
                }
            });
        },

        clickedActiveProductTabs: function () {
            var productTabsSection = $('[data-product-tabs]');

            productTabsSection.each(function () {
                var self = $(this),
                    listTabs = self.find('.list-product-tabs'),
                    tabLink = listTabs.find('[data-product-tabTop]'),
                    dataRow = self.find('.list-product-tabs').data('row'),
                    tabContent = self.find('[data-product-TabContent]');

                var linkActive = self.find('.list-product-tabs .tab-links.active'),
                    activeTab = self.find('.product-tabs-content .tab-content.active');

                cospora.doAjaxProductTabs(linkActive.data('href'), activeTab.find('.loading'), activeTab.find('.products-grid'), dataRow);

                tabLink.off('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();


                    if($(this).hasClass('active')) {
                        return;
                    }

                    if (!$(this).hasClass('active')) {
                        var curTab = $(this),
                            curTabContent = $(curTab.data('target'));                          

                        tabLink.removeClass('active');
                        tabContent.removeClass('active');    

                        if (!curTabContent.find('.products-grid').hasClass('slick-initialized')) {
                            cospora.doAjaxProductTabs(curTab.data('href'), curTabContent.find('.loading'), curTabContent.find('.products-grid'), dataRow);
                        }            

                        curTab.addClass('active');
                        curTabContent.addClass('active');
                    };
                });
            });
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent, dataRow) {
            $.ajax({
                type: "get",
                url: window.router + handle,
                cache: false,
                data: {
                    view: 'json',
                    limit: '&' + dataRow
                },

                beforeSend: function () {
                    loadingElm.html('<div class="lds-dual-ring"></div>');
                },

                success: function (data) {
                    loadingElm.hide();

                    if (handle == '/collections/?view=json') {
                        loadingElm.text('Please link to collections').show();
                    } else {
                        curTabContent.html($(data).find('.grid-item').html());

                        if (!curTabContent.hasClass('slick-initialized') && curTabContent.parent().hasClass('layout_carousel')){
                            cospora.initProductTabsSlider(curTabContent.parent());
                        };

                        if (cospora.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('.currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                        cospora.translateBlock('[data-product-tabs]');
                        cospora.initColorSwatchGrid();
                        cospora.initWishListIcons();

                        cospora.cosporaTimeout = setTimeout(function () {
                            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                            };
                        }, 1000);
                    };
                },

                error: function (xhr, text) {
                    loadingElm.text('Sorry, there are no products in this collection').show();
                }
            });
        },


        initProductTabsSlider: function (slt) {
            slt.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row');


                if (productGrid.not('.slick-initialized') && productGrid.find('.grid-item').length) {
                    productGrid.slick({
                        slidesToShow: productGrid.data('row'),
                        slidesToScroll: productGrid.data('row'),
                        dots: false,
                        infinite: false,
                        speed: 1000,
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                        responsive: [
                             {
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                    dots: false,
                                    arrows: true,
                                }
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }

                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if (gridItemWidth >= 3) {
                                                return this.slidesToShow = 3;
                                            } else {
                                                this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 3) {
                                                return this.slidesToScroll = 3;
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    dots: true
                                }
                            },
                            {
                                breakpoint: 321,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                }
            });
        },

        initBlogPostSlider: function() {
            var blogBlock = $('[data-blogs-slider]');

            blogBlock.each(function() {
                var self = $(this),
                    rows = self.data('rows');

                if(self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: rows,
                        slidesToScroll: 1,
                        dots: true,
                        speed: 800,
                        autoplay: false,
                        arrows: false,
                        responsive: [
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToScroll: 2,
                                    slidesToShow: 2
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToScroll: 1,
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });
                };
            });
        },
        initTrendingSlider: function() {
            var blogBlock = $('[data-trending-slider]');

            blogBlock.each(function() {
                var self = $(this),
                    rows = self.data('rows');

                if(self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        dots: true,
                        speed: 800,
                        autoplay: false,
                        arrows: false,
                        responsive: [
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToScroll: 2,
                                    slidesToShow: 2
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToScroll: 1,
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });
                };
            });
        },

        initCountdown: function () {
            var countdownElm = $('[data-countdown]');

            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');

                self.countdown(countdownValue, function (event) {
 
                    $(this).html(event.strftime('' +
                        '<div class="clock-item"><span class="num">%D</span><span class="text">days</span></div>' +
                        '<div class="clock-item"><span class="num">%H</span><span class="text">hours</span></div>' +
                        '<div class="clock-item"><span class="num">%M</span><span class="text">mins</span></div>' +
                        '<div class="clock-item"><span class="num">%S</span><span class="text">secs</span></div>'));

                });
            });
        },

        initCountdownNormal: function () {
            var countdownElm = $('[data-countdown-normal]');

            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');

                    self.countdown(countdownValue, function (event) {
                        $(this).html(event.strftime('' +
                            '<div class="clock-item"><span class="num">%D</span><span>D</span></div>' +
                            '<div class="clock-item"><span class="num">%H</span><span>H</span></div>' +
                            '<div class="clock-item"><span class="num">%M</span><span>M</span></div>' +
                            '<div class="clock-item"><span class="num">%S</span><span>S</span></div>'));
                    });
                
            });
        },

        sliderMegaMenu: function(){
          if($('.featuredProductCarousel').length){
            $('.featuredProductCarousel').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                arrows: true,
                autoplay: false,
                nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                speed : 1000
            });      
          }
          $(".site-nav li").mouseover(function() {
              $('.featuredProductCarousel').get(0).slick.setPosition();
          }); 
        },

    
        appendMenuMobile: function() {
            var menuWrap = $('.header-pc .wrapper-navigation .nav-bar'),
                dropdownMenu = $('.site-nav'),
                menuWrapMobile = $('.jas-mb-style .nav-bar');

            if (window.innerWidth >= 1200) {
                dropdownMenu.appendTo(menuWrap);
            } else {
                dropdownMenu.appendTo(menuWrapMobile);
            }
            cospora.initToggleSubMenuMobile();
        },

        appendLanguageMobile: function() {
            var languageMB = $('.header-pc .language-groups-mb'),
                languagePC = $('.header-pc .language-groups-pc');

            if (window.innerWidth >= 1200) {
                languageMB.appendTo(languagePC);
            } else {
                languagePC.appendTo(languageMB);
            }
        },

        initToggleSubMenuMobile: function() {
            var mainMenu = $('.main-menu.jas-mb-style'),
                siteNav = $('.site-nav'),
                iconDropdown = siteNav.find('[data-toggle-menu-mb]');

                
            iconDropdown.off('click.dropdownMenu').on('click.dropdownMenu', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curParent = $(this).parent(),
                    curMenu = curParent.next('.sub-menu-mobile');

                if (curMenu.hasClass('sub-menu-open')) {
                    curMenu.removeClass('sub-menu-open');
                } else {
                    curMenu.addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                };
            });

            cospora.linkClickToggleSubMenuMobile(mainMenu);
        },

        linkClickToggleSubMenuMobile: function (mainMenu) {
            var menuMobile = $('.site-nav .dropdown'),
                iconDropdown = menuMobile.find('[data-toggle-menu-mb]'),
                menuMobileLabel = $('.sub-menu-mobile .menu-mb-title');

            if (iconDropdown.length && iconDropdown.is(':visible')) {

                menuMobile.off('click.current').on('click.current', function (e) {
                    e.stopPropagation();

                    $(this).children('.sub-menu-mobile').addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                });

                menuMobile.find('.menu__moblie').on('click', function (e) {
                    e.stopPropagation();
                });

                menuMobileLabel.off('click.closeMenu').on('click.closeMenu', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).parent().removeClass('sub-menu-open');

                    if (!$(this).closest('.menu-lv-2').length) {
                        mainMenu.css({
                            "overflow": ""
                        });
                    };
                })
            };
        },

        openEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeIn(1000);
        },

        closeEmailModalWindow: function (newsletterWrapper,expire) {
            newsletterWrapper.fadeOut(1000);

            var inputChecked = newsletterWrapper.find('input[name="dismiss"]').prop('checked');

            if (inputChecked || !newsletterWrapper.find('input[name="dismiss"]').length)
                $.cookie('emailSubcribeModal', 'closed', {
                    expires: expire,
                    path: '/'
                });
        },

        initNewsLetterPopup: function () {
            if (window.newsletter_popup) {
                var newsletterWrapper = $('[data-newsletter]'),
                    closeWindow = newsletterWrapper.find('.close-window'),
                    delay = newsletterWrapper.data('delay'),
                    expire = newsletterWrapper.data('expire'),
                    modalContent = newsletterWrapper.find('.halo-modal-content');

                if ($.cookie('emailSubcribeModal') != 'closed') {
                    cospora.cosporaTimeout = setTimeout(function () {
                        cospora.openEmailModalWindow(newsletterWrapper);
                    }, delay);
                };

                closeWindow.click(function (e) {
                    e.preventDefault();

                    cospora.closeEmailModalWindow(newsletterWrapper,expire);
                });

                newsletterWrapper.on('click', function (e) {
                    if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                        cospora.closeEmailModalWindow(newsletterWrapper,expire);
                    };
                });

                $('#email_signup form').submit(function () {
                    if ($('#email_signup .email').val() != '') {
                        cospora.closeEmailModalWindow(newsletterWrapper,expire);
                    };
                });
            };
        },

        initSidebarProductSlider: function () {
            var sidebarWidgetProduct = $('[data-sidebar-product]');

            sidebarWidgetProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid');

                if (productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                    });
                }
            });
        },

        initSliderFeaturedProducts: function () {
            var featuredProduct = $('[data-featured-products]');

            featuredProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row'),
                    hasRightSidebar = $('.halo-product-content .pro-page [data-has-right-sidebar]');

                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        get slidesToShow() {
                            if (hasRightSidebar.length) {
                                return this.slidesToShow = 5;
                            } else {
                                return this.slidesToShow = productGrid.data('row');
                            }
                        },

                        get vertical() {
                            if(productGrid.hasClass('verticle')) {
                                return this.vertical = true;
                            }else {
                                return this.vertical = false;
                            }
                        },

                        get slidesToScroll() {
                            if(productGrid.hasClass('verticle')) {
                                return this.slidesToScroll = 1;
                            }else {
                                return this.slidesToScroll = productGrid.data('row');
                            }
                        },

                        speed: 1000,
                        infinite: false,

                        get dots() {
                            if(self.hasClass('has-banner')) {
                                return this.dots = true;
                            }else {
                                return this.dots = false;
                            };
                        },

                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                        responsive: [
                            {
                                breakpoint: 1400,
                                settings: {
                                    get slidesToShow() {
                                        if(self.hasClass('has-banner')) {
                                            return this.slidesToShow = 3;
                                        }else {
                                            if(gridItemWidth > 5) {
                                                return this.slidesToShow = 5;
                                            }
                                            else {
                                                return this.slidesToShow = productGrid.data('row');
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('has-banner')) {
                                            return this.slidesToScroll = 3;
                                        }else {
                                            if(productGrid.hasClass('verticle')) {
                                                return this.slidesToScroll = 1;
                                            }else {
                                                if(gridItemWidth >= 4) {
                                                    return this.slidesToScroll = 4;
                                                }else if(gridItemWidth = 3) {
                                                    return this.slidesToScroll = 3;
                                                }else {
                                                    return this.slidesToScroll = 2;
                                                }
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    vertical: false,
                                    get slidesToShow() {
                                        if(self.hasClass('has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    vertical: false,
                                    get slidesToShow() {
                                        if(gridItemWidth >= 3) {
                                            return this.slidesToShow = 3;
                                        }else {
                                            return this.slidesToShow = 2
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(gridItemWidth >= 3) {
                                            return this.slidesToScroll = 3;
                                        }else {
                                            return this.slidesToScroll = 2
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    vertical: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                };
            });
        }, 

        initSliderRelatedProducts: function () {
            var featuredProduct = $('[data-related-products]');

            featuredProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row'),
                    hasRightSidebar = $('.halo-product-content .pro-page [data-has-right-sidebar]');

                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        get slidesToShow() {
                            if (hasRightSidebar.length) {
                                return this.slidesToShow = 4;
                            } else {
                                return this.slidesToShow = productGrid.data('row');
                            }
                        },

                        get vertical() {
                            if(productGrid.hasClass('verticle')) {
                                return this.vertical = true;
                            }else {
                                return this.vertical = false;
                            }
                        },

                        get slidesToScroll() {
                            if(productGrid.hasClass('verticle')) {
                                return this.slidesToScroll = 1;
                            }else {
                                return this.slidesToScroll = productGrid.data('row');
                            }
                        },

                        speed: 1000,
                        infinite: false,

                        get dots() {
                            if(self.hasClass('has-banner')) {
                                return this.dots = true;
                            }else {
                                return this.dots = false;
                            };
                        },

                        nextArrow: '<button type="button" class="slick-next"><svg id="slick-arrow-next2" viewBox="0 0 9 18"><polygon points="3.6,11 5.7,9 3.6,7 0,3.3 0,0 2,2 7,7 9,9 7,11 2,16 0,18 0,14.7 "/></svg></button>',
                        prevArrow: '<button type="button" class="slick-prev"><svg id="slick-arrow-prev2" viewBox="0 0 9 18"><polygon points="5.4,11 3.3,9 5.4,7 9,3.3 9,0 7,2 2,7 0,9 2,11 7,16 9,18 9,14.7 "/></svg></button>',
                        responsive: [
                            {
                                breakpoint: 1400,
                                settings: {
                                    get slidesToShow() {
                                        if(self.hasClass('has-banner')) {
                                            return this.slidesToShow = 3;
                                        }else {
                                            if(gridItemWidth > 4) {
                                                return this.slidesToShow = 4;
                                            }
                                            else {
                                                return this.slidesToShow = productGrid.data('row');
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('has-banner')) {
                                            return this.slidesToScroll = 3;
                                        }else {
                                            if(productGrid.hasClass('verticle')) {
                                                return this.slidesToScroll = 1;
                                            }else {
                                                if(gridItemWidth >= 4) {
                                                    return this.slidesToScroll = 4;
                                                }else if(gridItemWidth = 3) {
                                                    return this.slidesToScroll = 3;
                                                }else {
                                                    return this.slidesToScroll = 2;
                                                }
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    vertical: false,
                                    get slidesToShow() {
                                        if(self.hasClass('has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    vertical: false,
                                    get slidesToShow() {
                                        if(gridItemWidth >= 3) {
                                            return this.slidesToShow = 3;
                                        }else {
                                            return this.slidesToShow = 2
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(gridItemWidth >= 3) {
                                            return this.slidesToScroll = 3;
                                        }else {
                                            return this.slidesToScroll = 2
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    vertical: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                };
            });
        },

        initOpenSidebar: function () {
            var sidebarLabelSlt = '.sidebar-label',
                sidebarLabelElm = $(sidebarLabelSlt);

            if (sidebarLabelElm.length) {
                body.off('click.openSidebar').on('click.openSidebar', sidebarLabelSlt, function () {
                    html.addClass('sidebar-open');
                })
            }
        },

        closeSidebar: function () {
            cospora.closeTranslate('.sidebar .close-sidebar', 'sidebar-open');
        },

        initSidebar: function () {
            this.initSidebarProductSlider();
            this.initOpenSidebar();
            this.closeSidebar();
            this.initDropdownSubCategoriesAtSidebar();
            this.initToggleWidgetTitleSidebarFilter();
        },

        initDropdownSubCategoriesAtSidebar: function () {
            var iconDropdownSlt = '.sidebar-links .link-action-wrapper';

            body.off('click.toggleSubCategories').on('click.toggleSubCategories', iconDropdownSlt, function (e) {

                var parent = $(e.target).parent();

                if (parent.hasClass('open')) {
                    parent.removeClass('open');
                    $(e.target).next().slideUp();                   
                } else {
                    parent.addClass('open');
                    $(e.target).next().slideDown();
                };
            })
        },

        queryParams: function () {
            Shopify.queryParams = {};

            if (location.search.length) {
                for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                    aKeyValue = aCouples[i].split('=');

                    if (aKeyValue.length > 1) {
                        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                    }
                }
            };
        },

        filterAjaxClick: function (baseLink) {
            delete Shopify.queryParams.page;

            var newurl = cospora.ajaxCreateUrl(baseLink);

            cospora.isSidebarAjaxClick = true;

            History.pushState({
                param: Shopify.queryParams
            }, newurl, newurl);
        },

        ajaxCreateUrl: function (baseLink) {
            var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

            if (baseLink) {
                if (newQuery != "")
                    return baseLink + "?" + newQuery;
                else
                    return baseLink;
            }
            return location.pathname + "?" + newQuery;
        },

        filterToolbar: function () {
            this.queryParams();
            this.setTextForSortbyFilter();
            this.setTextForLimitedFilter();
            this.ajaxFilterSortby();
            this.ajaxFilterLimit();
            this.addEventViewModeLayout();
        },

        setTextForSortbyFilter: function () {
            var filterSortby = $('[data-sortby]'),
                labelTab = filterSortby.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                sortbyLinkActive = labelTab.next().find('li.active'),
                text = sortbyLinkActive.text();

            labelText.text(text);

            if (Shopify.queryParams.sort_by) {
                var sortBy = Shopify.queryParams.sort_by,
                    sortByLinkActive = filterSortby.find('span[data-href="' + sortBy + '"]'),
                    sortByText = sortByLinkActive.text();

                labelText.text(sortByText);
                labelTab.next().find('li').removeClass('active');
                sortByLinkActive.parent().addClass('active');
            };
        },

        setTextForLimitedFilter: function () {
            var filterLimited = $('[data-limited-view]'),
                labelTab = filterLimited.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                limitedLinkActive = labelTab.next().find('li.active'),
                text = limitedLinkActive.text();

            labelText.text(text);

            if (filterLimited.length) {
                var limited = filterLimited.find('li.active span').data('value'),
                    limitedActive = filterLimited.find('span[data-value="' + limited + '"]'),
                    limitedText = limitedActive.text();

                labelText.text(limitedText);
                labelTab.next().find('li').removeClass('active');
                limitedActive.parent().addClass('active');
            };
        },

        ajaxFilterSortby: function () {
            var sortbyFilterSlt = '[data-sortby] li span',
                sortbyFilter = $(sortbyFilterSlt);

            body.off('click.sortBy', sortbyFilterSlt).on('click.sortBy', sortbyFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!parent.hasClass('active')) {
                    Shopify.queryParams.sort_by = $(this).attr('data-href');

                    cospora.filterAjaxClick();

                    var newurl = cospora.ajaxCreateUrl();

                    cospora.doAjaxToolbarGetContent(newurl);
                };

                sortbyFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },

        ajaxFilterLimit: function () {
            var limitFilterSlt = '[data-limited-view] li',
                limitFilter = $(limitFilterSlt);

            body.off('click.sortBy', limitFilterSlt).on('click.sortBy', limitFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!self.hasClass('active')) {
                    var dataValue = self.children('.item-per-page-number').data('value'),
                        dataText = self.data('text'),
                        value = "" + dataValue + "";

                    // $('[data-limited-view] .label-tab .label-text').html('<span name="paginateBy" class="label-text">'+ value +' '+ dataText +'</span>');

                    $('[data-limited-view] .label-tab .label-text').text(value);
                    cospora.doAjaxLimitGetContent(value);
                };

                limitFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },

        doAjaxLimitGetContent: function (value) {
            if (cospora.isAjaxLoading) return;

            $.ajax({
                type: "Post",
                url: '/cart.js',
                data: {
                    "attributes[pagination]": value
                },

                success: function (data) {
                    window.location.reload();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    cospora.showModal('.ajax-error-modal');
                },
                dataType: 'json'
            });
        },

        doAjaxToolbarGetContent: function (newurl) {
            if (cospora.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    cospora.showLoading();
                },

                success: function (data) {
                    cospora.ajaxMapData(data);
                    cospora.initColorSwatchGrid();
                    cospora.setTextForSortbyFilter();

                    cospora.initSidebarProductSlider();                   
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    cospora.showModal('.ajax-error-modal');
                },

                complete: function () {
                    cospora.hideLoading();
                }
            });
        },

        filterSidebar: function () {
            this.queryParams();
            this.ajaxFilterTags();
            this.ajaxFilterClearTags();
            this.ajaxFilterClearAll();
        },

        ajaxFilterTags: function () {
            body.off('click.filterTags').on('click.filterTags', '.sidebar-tags .list-tags a, .sidebar-tags .list-tags label, .refined .selected-tag', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var newTags = [];

                if (Shopify.queryParams.constraint) {
                    newTags = Shopify.queryParams.constraint.split('+');
                };

                //one selection or multi selection
                if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(':checked')) {
                    //remove other selection first
                    var otherTag = $(this).closest('.sidebar-tags, .refined-widgets').find('input:checked');

                    if (otherTag.length) {
                        var tagName = otherTag.val();

                        if (tagName) {
                            var tagPos = newTags.indexOf(tagName);

                            if (tagPos >= 0) {
                                //remove tag
                                newTags.splice(tagPos, 1);
                            }
                        }
                    };
                };

                var tagName = $(this).prev().val();

                if (tagName) {
                    var tagPos = newTags.indexOf(tagName);

                    if (tagPos >= 0) {
                        newTags.splice(tagPos, 1);
                    } else {
                        newTags.push(tagName);
                    };
                };

                if (newTags.length) {
                    Shopify.queryParams.constraint = newTags.join('+');
                } else {
                    delete Shopify.queryParams.constraint;
                };

                cospora.filterAjaxClick();

                var newurl = cospora.ajaxCreateUrl();

                cospora.doAjaxSidebarGetContent(newurl);
            });
        },

        ajaxFilterClearTags: function () {
            var sidebarTag = $('.sidebar-tags');

            sidebarTag.each(function () {
                var sidebarTag = $(this);

                if (sidebarTag.find('input:checked').length) {
                    //has active tag
                    sidebarTag.find('.clear').show().click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var currentTags = [];

                        if (Shopify.queryParams.constraint) {
                            currentTags = Shopify.queryParams.constraint.split('+');
                        };

                        sidebarTag.find("input:checked").each(function () {
                            var selectedTag = $(this);
                            var tagName = selectedTag.val();

                            if (tagName) {
                                var tagPos = currentTags.indexOf(tagName);
                                if (tagPos >= 0) {
                                    //remove tag
                                    currentTags.splice(tagPos, 1);
                                };
                            };
                        });

                        if (currentTags.length) {
                            Shopify.queryParams.constraint = currentTags.join('+');
                        } else {
                            delete Shopify.queryParams.constraint;
                        };

                        cospora.filterAjaxClick();

                        var newurl = cospora.ajaxCreateUrl();

                        cospora.doAjaxSidebarGetContent(newurl);
                    });
                }
            });
        },

        ajaxFilterClearAll: function () {
            var clearAllSlt = '.refined-widgets a.clear-all';
            var clearAllElm = $(clearAllSlt);

            body.off('click.clearAllTags', clearAllSlt).on('click.clearAllTags', clearAllSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                delete Shopify.queryParams.constraint;

                cospora.filterAjaxClick();

                var newurl = cospora.ajaxCreateUrl();

                cospora.doAjaxSidebarGetContent(newurl);
            });
        },

        doAjaxSidebarGetContent: function (newurl) {
            if (cospora.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    cospora.showLoading();
                },

                success: function (data) {
                    cospora.ajaxMapData(data);
                    cospora.initColorSwatchGrid();
                    cospora.ajaxFilterClearTags();

                    cospora.initSidebarProductSlider();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    cospora.showModal('.ajax-error-modal');
                },

                complete: function () {
                    cospora.hideLoading();
                }
            });
        },

        ajaxMapData: function (data) {
            var curCollTemplate = $('.collection-template'),
                curBreadcrumb = curCollTemplate.find('.breadcrumb'),
                curSidebar = curCollTemplate.find('.sidebar'),
                curCollHeader = curCollTemplate.find('.collection-header'),
                curProColl = curCollTemplate.find('.product-collection'),
                curPadding = curCollTemplate.find('.padding'),

                newCollTemplate = $(data).find('.collection-template'),
                newBreadcrumb = newCollTemplate.find('.breadcrumb'),
                newSidebar = newCollTemplate.find('.sidebar'),
                newCollHeader = newCollTemplate.find('.collection-header'),
                newProColl = newCollTemplate.find('.product-collection'),
                newPadding = newCollTemplate.find('.padding');

            curBreadcrumb.replaceWith(newBreadcrumb);
            curSidebar.replaceWith(newSidebar);
            curCollHeader.replaceWith(newCollHeader);
            curProColl.replaceWith(newProColl);

            if (curPadding.length > 0) {
                curPadding.replaceWith(newPadding);
            } else {
                if(curCollTemplate.find('.col-main').length) {
                    curCollTemplate.find('.col-main').append(newPadding);
                } else {
                    curCollTemplate.find('.col-no-sidebar').append(newPadding);
                }
                
            };

            cospora.translateBlock('.collection-template');

            cospora.initWishListIcons();
           
            if ($('[data-view-as]').length) {
                cospora.viewModeLayout();
            };

            if (cospora.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            };

            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            };
        },

        initToggleWidgetTitleSidebarFilter: function () {
            var widgetTitleSlt = '[data-has-collapse] .widget-title';

            body.off('click.toggleWidgetContent').on('click.toggleWidgetContent', widgetTitleSlt, function () {
                $(this).toggleClass('open');
                $(this).next().slideToggle();
            });

            var widgetTitleSltCollNoSidebar = '[data-has-collapse-no-sidebar] .widget-title';

            if(win.innerWidth() < 1200) {
                body.off('click.toggleWidgetContent2').on('click.toggleWidgetContent2', widgetTitleSltCollNoSidebar, function () {
                    $(this).toggleClass('open');
                    $(this).next().slideToggle();
                });
            }             
        },

        initInfiniteScrolling: function () {
            var infiniteScrolling = $('.infinite-scrolling');
            var infiniteScrollingLinkSlt = '.infinite-scrolling a';

            if (infiniteScrolling.length) {

                body.off('click.initInfiniteScrolling', infiniteScrollingLinkSlt).on('click.initInfiniteScrolling', infiniteScrollingLinkSlt, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!$(this).hasClass('disabled')) {
                        var url = $(this).attr('href');

                        cospora.doAjaxInfiniteScrollingGetContent(url);
                    };
                });

                if (window.infinity_scroll_feature) {
                    $(window).scroll(function () {
                        if (cospora.isAjaxLoading) return;

                        var collectionTplElm = $('[data-section-type="collection-template"]');

                        if (!collectionTplElm.length) {
                            collectionTplElm = $('[data-search-page]');
                        };

                        var collectionTop = collectionTplElm.offset().top;
                        var collectionHeight = collectionTplElm.outerHeight();
                        var posTop = collectionTop + collectionHeight - $(window).height();

                        console.log(collectionTop);


                        if ($(this).scrollTop() > posTop && $(this).scrollTop() < (posTop + 200)) {
                            var button = $(infiniteScrollingLinkSlt);

                            if (button.length && !button.hasClass('disabled')) {
                                var url = button.attr('href');

                                cospora.doAjaxInfiniteScrollingGetContent(url);
                            };
                        };
                    });
                };
            }
        },

        doAjaxInfiniteScrollingGetContent: function (url) {
            if (cospora.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: url,

                beforeSend: function () {
                    cospora.showLoading();
                },

                success: function (data) {
                    cospora.ajaxInfiniteScrollingMapData(data);
                    cospora.initColorSwatchGrid();
                    if ($('[data-view-as]').length) {
                        cospora.viewModeLayout();
                    };
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    cospora.showModal('.ajax-error-modal');
                },

                complete: function () {
                    cospora.hideLoading();
                }
            });
        },

        slideLookbookProducts: function() {
          var slideLookbook = $('[data-init-slide-lookbook]');
          slideLookbook.each(function () {
            var self = $(this),
                rows = self.data('row');
            if (self.not('.slick-initialized')) {
              self.slick({
                infinite: false,
                slidesToShow: rows,
                slidesToScroll: 3,
                dots: true,
                speed: 800,
                nextArrow: '<button type="button" class="slick-next"><svg id="slick-arrow-next2" viewBox="0 0 9 18"><polygon points="3.6,11 5.7,9 3.6,7 0,3.3 0,0 2,2 7,7 9,9 7,11 2,16 0,18 0,14.7 "/></svg></button>',
                prevArrow: '<button type="button" class="slick-prev"><svg id="slick-arrow-prev2" viewBox="0 0 9 18"><polygon points="5.4,11 3.3,9 5.4,7 9,3.3 9,0 7,2 2,7 0,9 2,11 7,16 9,18 9,14.7 "/></svg></button>',
                responsive: [{
                  breakpoint: 1200,
                  settings: {
                    slidesPerRow: 1,
                    slidesToShow: 4,
                  }
                },
                {
                   breakpoint: 992,
                   settings: {
                     slidesPerRow: 1,
                     slidesToShow: 3,
                   }
                },
                {
                   breakpoint: 768,
                   settings: {
                     slidesPerRow: 1,
                     slidesToShow: 2,
                     dots: true,
                   }
                }
                ]
              });
            }
          });
        },

        ajaxInfiniteScrollingMapData: function (data) {
            var collectionTemplate = $('.collection-template'),
                currentProductColl = collectionTemplate.find('.product-collection'),
                newCollectionTemplate = $(data).find('.collection-template'),
                newProductColl = newCollectionTemplate.find('.product-collection'),
                newProductItem = newProductColl.children('.grid-item').not('.banner-img');

            showMoreButton = $('.infinite-scrolling a');

            if (newProductColl.length) {
                currentProductColl.append(newProductItem);

                if ($('.collection-template .product-collection[data-layout]').length) {
                    cospora.cosporaTimeout = setTimeout(function () {
                        currentProductColl.isotope('appended', newProductItem).isotope('layout');
                    }, 700);
                }

                cospora.translateBlock('.product-collection');

                if ($(data).find('.infinite-scrolling').length > 0) {
                    showMoreButton.attr('href', newCollectionTemplate.find('.infinite-scrolling a').attr('href'));
                } else {
                    //no more products
                    var noMoreText = window.inventory_text.no_more_product;

                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;

                    showMoreButton.html(noMoreText).addClass('disabled');
                };

                if (cospora.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };
  
                if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                };
            };
        },

        addEventViewModeLayout: function () {
            cospora.setActiveViewModeMediaQuery();

            body.on('click', '.view-mode .view-as', function (e) {
                e.preventDefault();

                var self = $(this),
                    parents = self.closest('[data-view-as]');

                if (!self.hasClass('active')) {
                    parents.find('.icon-mode').removeClass('active');
                    self.find('.icon-mode').addClass('active');

                    cospora.viewModeLayout();
                };

            });
        },

        viewModeLayout: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                viewAs = viewModeActive.data('view'),
                products = $('.collection-template .product-collection'),
                gridItem = products.find('.grid-item'),
                strClass = 'col-6 col-md-4 col-lg-3',
                gridClass = 'col-6 col-md-4 col-lg-3 products-grid';

            switch (viewAs) {
                case 'grid':
                    products.removeClass('products-list').addClass('products-grid');
                    gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3');
                    gridItem.removeClass('col-12');
                    break;

                case 'list':
                    products.removeClass('products-grid').addClass('products-list');
                    gridItem.removeClass(strClass).addClass('col-12');
                    break;
            };
        },

        setActiveViewModeMediaQuery: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                if (col === 3 || col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="2"]').addClass('active');
                }
            } else if (windowWidth < 992 && windowWidth >= 768) {
                if (col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="3"]').addClass('active');
                }
            } else if (windowWidth < 1200 && windowWidth >= 992) {
                if (col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="4"]').addClass('active');
                }
            }

            if (viewMode.length) {
                cospora.viewModeLayout();
            }
        },

        initPaginationPage: function () {
            var paginationSlt = '.pagination-page a';

            body.off('click', paginationSlt).on('click', paginationSlt, function (e) {
                if(Shopify.queryParams){
                    e.preventDefault();

                    var page = $(this).attr('href').match(/page=\d+/g);

                    if (page) {
                        Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
                        if (Shopify.queryParams.page) {
                            var newurl = cospora.ajaxCreateUrl();

                            cospora.isSidebarAjaxClick = true;

                            History.pushState({
                                param: Shopify.queryParams
                            }, newurl, newurl);

                            cospora.doAjaxToolbarGetContent(newurl);

                            var elm = $('[data-section-type="collection-template"] .toolbar');

                            if (!elm.length) {
                                elm = $('[data-search-page]');
                            }

                            var top = elm.offset().top;

                            $('body,html').animate({
                                scrollTop: top
                            }, 600);
                        };
                    };
                }

            });
        },

        changeQuantityAddToCart: function () {
            var buttonSlt = '[data-minus-quantity], [data-plus-quantity]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]');

                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 0):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);
            });
        },
        
        initAddToCart: function () {

            var btnAddToCartSlt = '[data-btn-addToCart]';
            var windowWidth = window.innerWidth;

            doc.off('click.addToCart', btnAddToCartSlt).on('click.addToCart', btnAddToCartSlt, function (e) {

                e.preventDefault();
                e.stopPropagation();
                var self = $(this);
                var thisForm = $(self.data('form-id'));
                var data = thisForm.serialize();        

                if (self.attr('disabled') !== "disabled") {
                    var productItem = self.closest('.product-item');

                    if (productItem.length < 1) {
                        var sectionsProduct = self.closest('[data-section-type="product"]');

                        if (!sectionsProduct.length) {
                            sectionsProduct = self.closest('.quickview-tpl');
                        }

                        productItem = sectionsProduct.find('.product-shop');
                    };

                    var form = productItem.find('form'),
                        handle = productItem.find('.product-grid-image').data('collections-related') || sectionsProduct.data('collections-related');

                    var variant_id = form.find('select[name=id]').val();
                    if (!variant_id) {
                        variant_id = form.find('input[name=id]').val();
                    };

                    var quantity = form.find('input[name=quantity]').val();
                    if (!quantity) {
                        quantity = 1;
                    };

                    switch (window.ajax_cart) {
                        case "none":
                            form.submit();
                            break;

                        case "normal":
                            var title = productItem.find('.product-title').html();
                            var image = productItem.find('.product-grid-image img').attr('data-srcset');
                            var variant = thisForm.find('#product-selectors option:selected, #product-select-qv option:selected').text().trim();

                            if(!image) {
                                image = productItem.siblings('.product-photos').find('.slick-current img[id|="product-featured-image"]').attr('src') || productItem.siblings('.product-photos').find('.slick-current img[id|="qv-product-featured-image"]').attr('src');
                            }

                            cospora.doAjaxAddToCartNormal(data, title, image, variant);
                            break;

                    };

                }
                return false;
            });
        },

        doAjaxAddToCartNormal: function(data, title, image, variant, dataBundle) {
            $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: data,
                dataType: "json",

                beforeSend: function () {
                    cospora.showLoading();
                },

                success: function () {
                    cospora.hideLoading();
                    var ajaxCartModal = $('[data-ajax-cart-success]'),
                        modalContent = ajaxCartModal.find('.cart-modal-content');

                    modalContent.find('.ajax-product-title').html(cospora.translateText(title));
                    if(variant != 'Default Title'){
                        modalContent.find('.size_option').html(variant);
                    }
                    modalContent.find('.ajax-product-image').attr('src', image);
                    modalContent.find('.message-added-cart').show();

                    if(dataBundle){
                        modalContent.parent().addClass('is-bundle');
                        var bundleList = modalContent;
                        dataBundle.forEach(function(item , index){
                          var bundleItem = '';
                          bundleItem += '<div class="item item-bundle">';
                          bundleItem += '<div class="ajax-left">';
                          bundleItem += '<p><img class="ajax-product-image" alt="&nbsp;" src="'+item.image+'" style="max-width:72px;"/></p>';
                          bundleItem += '</div>';
                          bundleItem += '<div class="ajax-right">';
                          bundleItem += '<div class="ajax-product-title"> '+ item.title + '<br>';
                          bundleItem += '</div>';
                          if(item.variant != 'Default Title'){
                          bundleItem += '<p class="size_option"> '+ item.variant + '</p>';
                          bundleItem += '<p class="success-message message-added-cart"> '+ window.inventory_text.message_iscart + '</p>';
                          }
                          bundleItem += '<p class="success-message message-added-cart no-variant"> '+ window.inventory_text.message_iscart + '</p>';
                          bundleItem += '</div>';
                          bundleItem += '</div>';

                          bundleList.append(bundleItem);
                        })
                    }
                    else{
                        modalContent.parent().removeClass('is-bundle');
                    } 




                    cospora.showModal('.add-ajax-success-modal');
                    cospora.updateDropdownCart();
                    cospora.initFreeShippingMessage();

                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    cospora.showModal('.ajax-error-modal');
                },

                complete: function () {
                    cospora.hideLoading();
                }
            });
        },

        changeVariantSelectOption: function() {
            var selectSlt = '[data-select-change-variant]';

            doc.on('change', selectSlt, function() {
                var value = $(this).val(),
                    dataImg = $(this).find('option:selected').data('img'),
                    dataPrice = $(this).find('option:selected').data('price'),
                    parent = $(this).closest('.grouped-product');

                parent.find('input[type=hidden]').val(value);
                parent.find('.product-img img').attr({ src: dataImg });
                parent.find('[data-price-change]').html(Shopify.formatMoney(dataPrice, window.money_format));

                if (cospora.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-select-change-variant] span.money', 'money_format');
                }
            });
        },

        closeSuccessModal: function () {
            var ajaxCartModal = $('[data-ajax-cart-success], [data-quickview-modal], [data-compare-modal], [data-compare-message-modal], [data-addToCart-modal]'),
                closeWindow = ajaxCartModal.find('.close-modal, .continue-shopping'),
                removeCodeIframe = $('.custom_video_qv  .videoWrapper .video_qv iframe'),
                modalContent = ajaxCartModal.find('.halo-modal-content');
  
            closeWindow.click(function (e) {
                e.preventDefault();
                

                ajaxCartModal.fadeOut(500, function () {
                    html.removeClass('halo-modal-open');
                    html.css({
                        "overflow": ""
                    });

                    if (body.hasClass('template-cart')) {
                        window.location.reload();
                    }
                    if (body.hasClass('popup-quickview')) {
                        body.removeClass('popup-quickview');
                        removeCodeIframe.remove();
                    }
                    if (body.hasClass('modal-open')) {
                        body.removeClass('modal-open');
                    }
                    if ($('.modal-backdrop').hasClass('show')) {
                        $('.modal-backdrop').removeClass('show');
                        $('.modal-backdrop').hide();
                    }
                      
                });
            });

            ajaxCartModal.on('click', function (e) {

                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    ajaxCartModal.fadeOut(500, function () {
                        html.removeClass('halo-modal-open');
                        html.css({
                            "overflow": ""
                        });

                        if (body.hasClass('template-cart')) {
                            window.location.reload();
                        }
                        if (body.hasClass('popup-quickview')) {
                            body.removeClass('popup-quickview');
                            $('.custom_video_qv .videoWrapper .video_qv iframe').remove();
                        }
                        if (body.hasClass('modal-open')) {
                            body.removeClass('modal-open');
                        }
                        if ($('.modal-backdrop').hasClass('show')) {
                            $('.modal-backdrop').removeClass('show');
                            $('.modal-backdrop').hide();
                        }

                        
                    });
                };
            });
        },

        initChangeQuantityButtonEvent: function () {
            var buttonSlt = '[data-minus-quantity-cart], [data-plus-quantity-cart]',
                buttonElm = $(buttonSlt);

            doc.off('click.updateCart').on('click.updateCart', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var btn = $(this);
                var id = btn.closest("[data-product-id]").data("product-id");
                var quantity = parseInt(btn.siblings('input[name="quantity"]').val());

                if (btn.hasClass('plus')) {
                    quantity += 1;
                } else {
                    quantity -= 1;
                };

                cospora.doAjaxUpdatePopupCart(quantity, id);

            });
        },


        initCartQty: function() {    
          $('.quantity .button').on('click',function(event) {
            event.preventDefault();
            jQuery(this).each(function() {
              var productItem = jQuery(this).parents('.product-item'),
                  parent = jQuery(this).parent();
              var productId = jQuery(productItem).attr('id');
              productId = productId.match(/\d+/g);

              var oldValue = jQuery(parent).find('.number').val(),
                  newVal = 1;

              if (jQuery(this).hasClass('inc')) {
                newVal = parseInt(oldValue) + 1;
              } else if (oldValue > 1) {
                newVal = parseInt(oldValue) - 1;
              }

              jQuery(parent).find('.number').val(newVal);
            });

            return false;
          });

        },

        initUpdateCart: function(){            
          $('.cart-form .update').on('click', function(event) {      
            event.preventDefault();
            var cartButton = $(this);
            var productItem = jQuery(this).parents('.product-item');
            var productId = jQuery(productItem).attr('id');
            productId = productId.match(/\d+/g);

            var Price = $(this).parents('.product-details').find('.price'),
                quantity = jQuery(this).parent().find('.number').val();

            cospora.doAjaxUpdateCart(productId, quantity, cartButton, Price, productItem);

          }); 

          $('.cart-form .remove ').on('click', function(event) {
            event.preventDefault();
            var productItem = jQuery(this).parents('.product-item'),
                productId = jQuery(productItem).attr('id');

            productId = productId.match(/\d+/g);
            Shopify.removeItem(productId, function(cart) {

              cospora.doUpdateDropdownCart(cart);

              $(productItem).remove();

              $('.total-price .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

              if (cospora.checkNeedToConvertCurrency()) {       
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
              }

              if ($('.cart-left ul li').children().length > 0) {
                $('.no-items').hide();
                $('.cart-form').show();
              } 

              else {             
                $('.cart-form').hide();
                $('.no-items').show();
              }

            });
          });

        },

        doAjaxUpdateCart: function(productId, quantity, cartButton, Price, productItem){
          var checkInv = $(cartButton).data('line'),
              price = parseFloat( Price.data('price') )*quantity,
              price2 = parseFloat( Price.data('price') )*checkInv;

          $.ajax({
            type: "post",
            url: "/cart/change.js",
            data: 'quantity=' + quantity + '&id=' + productId,
            dataType: 'json',
            beforeSend: function() {
              cartButton.find('i').removeClass('fa-check').addClass('fa-circle-o-notch fa-spin');
            },
            success: function(cart) {
              if(quantity == 0){
                productItem.remove();
                if ($('.cart-form .cart-left ul li').children().length > 0) {
                  $('.cart-form .no-items').hide();
                  $('.cart-form .cart-form').show();
                } 

                else {             
                  $('.cart-form .cart-form').hide();
                  $('.cart-form .no-items').show();
                }
              }

              cartButton.find('i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-check');

              setTimeout(function() {cartButton.find('i').removeClass('fa-check')},2000);

              Price.html(Shopify.formatMoney(price, window.money_format));  

              $('.total-price .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

              if(quantity > checkInv){

                var title = $(productItem).find('.product-name > span').html();

                $(productItem).find('.extra').css('border-color','red');

                $('input#updates_' + productId + '').val(checkInv);

                Price.html(Shopify.formatMoney(price2, window.money_format));

                $('.ajax-error-message').text('You can only add '+ checkInv +' '+ title +' to your cart.');

                cospora.showModalError('.ajax-error-modal');
              }
              else{
                $(productItem).find('.extra').css('border-color','#dcdcdc');
              }

              cospora.updateDropdownCart();

            },
            error: function(xhr) {          
              cartButton.find('i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-exclamation-circle');
              setTimeout(function() {cartButton.find('i').removeClass('fa-exclamation-circle')},5000);
              $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
              cospora.showModalError('.ajax-error-modal');
            }
          });

        },

        changeQuantityDropdownCart: function () {
            var buttonSlt = '[data-minus], [data-plus]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]');

                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 1):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);


                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                var qtynum=parseInt(input.val());

                Shopify.changeItem(productId, qtynum, function (cart) {
                    cospora.doUpdateDropdownCart(cart);
                    cospora.initFreeShippingMessage();
                });


            });
        },
        initFreeShippingMessage: function () {
            Shopify.getCart(function (cart) {
                cospora.FreeShippingMessage(cart);
            })
        },
        FreeShippingMessage: function (cart) {
            var freeshipEligible = 0;

            var freeshipText = window.free_shipping_text.free_shipping_message_1;
            var freeshipText2 = window.free_shipping_text.free_shipping_message_2;
            var freeshipText3 = window.free_shipping_text.free_shipping_message_3;
            var extraPrice = 0;
            var shipVal = window.free_shipping_text.free_shipping_1;

            var freeshipPrice = parseInt(window.free_shipping_price);

            if (window.multi_lang && translator.isLang2()) {
                freeshipText = window.lang2.cart.general.free_shipping_message_1;
                freeshipText2 = window.lang2.cart.general.free_shipping_message_2;
                freeshipText3 = window.lang2.cart.general.free_shipping_message_3;
                shipVal = window.lang2.cart.general.free_shipping_1;
            }

            var cartTotalPrice =  parseInt(cart.total_price) / 100;

            if (cartTotalPrice >= freeshipPrice) {
              freeshipEligible = 1;
            } else {
              extraPrice = parseInt(freeshipPrice - cartTotalPrice);
              freeshipText = freeshipText2 + "<span> $" + extraPrice + " </span>" + freeshipText3;
              freeshipBar = (cartTotalPrice * 100)/freeshipPrice ;

              if (window.multi_lang && translator.isLang2()) {
                      shipVal = window.lang2.cart.general.free_shipping_2;
              } else {
                shipVal = window.free_shipping_text.free_shipping_2;
              }
              
            }

            $('#dropdown-cart .free_shipping_massage').html(freeshipText);
            $('#dropdown-cart .summary .free_shipping .text').html(shipVal);
        },
        initQuantityInputChangeEvent: function () {
            var quantityIptSlt = '[data-quantity-input]';

            doc.on('change', quantityIptSlt, function () {
                var id = $(this).closest("[data-product-id]").data("product-id"),
                    quantity = parseInt($(this).val());

                cospora.doAjaxUpdatePopupCart(quantity, id);
            });
        },

        removeCartItem: function () {
            var removeSlt = '.cart-remove';

            doc.on('click', removeSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var id = $(this).closest("[data-product-id]").data("product-id");

                cospora.doAjaxUpdatePopupCart(0, id);
            });
        },

        initSoldOutProductShop: function () {
            var soldProduct = $('.product-shop [data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').split(","),
                        hours = self.data('hours').split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },

        initCustomerViewProductShop: function () {
            var customerView = $('.product-shop [data-customer-view]');

            if (customerView.length) {
                customerView.each(function () {
                    var self = $(this);

                    setInterval(function () {
                        var views = self.data('customer-view').split(","),
                            i = Math.floor(Math.random() * views.length);

                        self.find('label').text(views[i]);
                    }, 5000);
                });
            }
        },

        initProductMoreview: function (productMoreview) {
            var sliderFor = productMoreview.find('.slider-for'),
                sliderNav = productMoreview.find('.slider-nav'),
                vertical = sliderNav.data('vertical');

            if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                sliderFor.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNav
                });

                sliderNav.slick({
                    infinite: true,
                    vertical: vertical,
                    get slidesToShow() {
                        return slidesToShow = sliderNav.data('rows');
                    },
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    asNavFor: sliderFor,
                    focusOnSelect: true,
                    nextArrow: '<button type="button" class="slick-next"><svg id="slick-arrow-next2" viewBox="0 0 9 18"><polygon points="3.6,11 5.7,9 3.6,7 0,3.3 0,0 2,2 7,7 9,9 7,11 2,16 0,18 0,14.7 "/></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg id="slick-arrow-prev2" viewBox="0 0 9 18"><polygon points="5.4,11 3.3,9 5.4,7 9,3.3 9,0 7,2 2,7 0,9 2,11 7,16 9,18 9,14.7 "/></svg></button>',
                    responsive: [{
                            breakpoint: 1281,
                            settings: { 
                                get slidesToShow() {
                                    if (vertical == true) {
                                        return slidesToShow = 4;
                                    } else {
                                        return slidesToShow = 5;
                                    }
                                },
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 1200,
                            settings: { 
                                vertical: false,
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        },
                        {
                            breakpoint: 360,
                            settings: {
                                vertical: false,
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                                dots: false
                            }
                        }
                    ]
                });
            };

            if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch) {     
                var swatch = productMoreview.closest('[data-more-view-product]').siblings('.product-shop').find('.swatch'),
                    swatchColor = swatch.find('.swatch-element.color'),
                    inputChecked = swatchColor.find(':radio:checked');
                    
                if(inputChecked.length) {
                    var className = inputChecked.data('filter');

                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            }
        },

        changeSwatch: function (swatchSlt) {       
            doc.on('change', swatchSlt, function () {
                var className = $(this).data('filter');
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();

                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');

                    

                if(className == undefined){
                    if($('input[data-filter]').is(':checked')){
                        var checked = $('input[data-filter]:checked').data('filter');
                        className = checked;
                    }
                }
                   
                if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch && className !== undefined) {
                    var productShop = $(swatchSlt).closest('.product-shop');

                    if(productShop.closest('.product-slider').length) {
                        var productImgs = productShop.closest('.product-slider').find('[data-moreview-product-slider]'),
                            sliderFor = productImgs.find('.slider-for'); 

                        sliderFor.slick('slickUnfilter');

                        if(sliderFor.find(className).length) {
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }    
                    }else {
                        var productImgs = productShop.prev('[data-more-view-product]');

                        if(productImgs.length) {
                            var sliderNav = productImgs.find('.slider-nav'),
                                sliderFor = productImgs.find('.slider-for');
                            
                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    }

                }
            });
        },

        initQuickView: function () {
            body.off('click.initQuickView', '.quickview-button').on('click.initQuickView', '.quickview-button', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var href = $(this).attr('id');

                cospora.doAjaxShowQuickView(href);
                cospora.closeSuccessModal();

                body.addClass('popup-quickview'); 
            });
        },

        doAjaxShowQuickView: function (href) {
            if (cospora.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: window.router + '/products/' + href + '?view=quickview',

                beforeSend: function () {  
                    cospora.showLoading();

                    html.css({
                        "overflow": "hidden"
                    });
                },

                success: function (data) {
                    var quickviewModal = $('[data-quickview-modal]'),
                        modalContent = quickviewModal.find('.halo-modal-body');

                    modalContent.html(data);

                    setTimeout(function () {
                        cospora.translateBlock('[data-quickview-modal]');
                        cospora.initProductMoreview($('[data-more-view-product-qv] .product-img-box'));
                        cospora.initSoldOutProductShop();
                        cospora.initCustomerViewProductShop();
                        cospora.changeSwatch('.quickview-tpl .swatch :radio');
                        cospora.initZoom();
                        cospora.setAddedForWishlistIcon(href);
                        if (cospora.checkNeedToConvertCurrency()) {
                          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        }

                       $.getScript("https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869")
                            .done(function() {
                                if(typeof addthis !== 'undefined') {
                                    addthis.init();
                                    addthis.layers.refresh();
                                }
                            })                       

                        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        };
                    }, 500);

                    cospora.hideLoading();

                    quickviewModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-ajax-cart-success]').is(':visible')) {
                            $('[data-ajax-cart-success]').hide();
                        }
                    });
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    cospora.hideLoading();
                    cospora.showModal('.ajax-error-modal');
                }
            });
        },

        initZoom: function () {
            var zoomElm = $('.product-img-box [data-zoom]');

            if (win.width() >= 1200) {
                zoomElm.zoom();
            } else {
                zoomElm.trigger('zoom.destroy');
            };
        },

        openSearchForm: function () {
            var iconSearchSlt = '[data-search-mobile-toggle]',
                wrapperHeader = $('.wrapper-header'),
                formSearch = wrapperHeader.find('.search-form');

            doc.off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.addClass('search-open');
            });

            doc.off('click.hideSearch').on('click.hideSearch', function (e) {
                var searchForm = $('.wrapper-header .search-form .search-bar');

                if (!searchForm.is(e.target) && !searchForm.has(e.target).length) {
                    html.removeClass('search-open');

                    $('.quickSearchResultsWrap').hide();
                }
            });
        },

        stickyFixedTopMenu: function() {
            if(window.fixtop_menu) {
                if(window.innerWidth >= 1200) {
                    $('[data-sticky-mb]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-pc]').sticky({
                                zIndex: 5
                            });

                            $('[data-sticky-pc]').on('sticky-start', function() {
                                body.addClass('has_sticky');
                                var heightNavSticky = $(".has_sticky .wrapper-navigation .main-menu").height(),
                                  totalTop = heightNavSticky + 35,
                                  stickySidebar = $('[data-sticky-sidebar]');

                                stickySidebar.css({"top": totalTop});
                            });

                            $('[data-sticky-pc]').on('sticky-end', function() {
                                body.removeClass('has_sticky');
                            });
                        }, 100
                    );
                } else {
                    $('[data-sticky-pc]').unstick();
                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-mb]').sticky({
                                zIndex: 4
                            });
                        }, 100
                    );
                };
            };
        },

        productPageInitProductTabs: function () {
          var listTabs = $('.tabs__product-page'),
              tabLink = listTabs.find('[data-tapTop]'),
              tabContent = listTabs.find('[data-TabContent]');

          tabLink.off('click').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var curTab = $(this),
                curTabContent = $(curTab.data('target')),
                ulElm = curTab.closest('.list-tabs');

            if (ulElm.length) {
              if (!$(this).hasClass('active')) {
                tabLink.removeClass('active');
                tabContent.removeClass('active');

                curTab.addClass('active');
                ulElm.next().find(curTab.data('target')).addClass('active');
              }
            } else {
              if($('.product-template-full-width').length) {
                if (!$(this).hasClass('active')) {
                  curTab.addClass('active');

                  curTabContent.show(0, function() {
                    $(document.body).trigger("sticky_kit:recalc");
                  });
                } else {
                  curTab.removeClass('active');

                  curTabContent.hide(0, function() {
                    $(document.body).trigger("sticky_kit:recalc");
                  });
                };
              } else if($('.has-sticky-product-img').length) {
                if (!$(this).hasClass('active')) {
                  curTab.addClass('active');
                  curTabContent.show();
                } else {
                  curTab.removeClass('active');
                  curTabContent.hide();
                };
              } else {
                if (!$(this).hasClass('active')) {
                  curTab.addClass('active');
                  curTabContent.slideDown();
                } else {
                  curTab.removeClass('active');
                  curTabContent.slideUp();
                };
              }

            };
          });

          var sprBadge = '.product-shop .spr-badge',
              btnReviewSlt = '.product-template-full-width .spr-summary-actions-newreview';

          doc.on('click.triggerTabsReviews', sprBadge, function () {
            if (listTabs.length) {
              $('html,body').animate({
                scrollTop: listTabs.offset().top
              }, 400);

              var activeTab = listTabs.find('[data-target="#collapse-tab2"]');

              if (!activeTab.hasClass('active')) {
                activeTab.trigger('click');
              }
            };
          });

          if($('.product-template-full-width').length) {
            doc.on('click', btnReviewSlt, function() {
              $(document.body).trigger("sticky_kit:recalc");
            });
          };
        },

        initStickyAddToCart: function() {
            var blockSticky = $('[data-sticky-add-to-cart]'),
                sltVariantActive = blockSticky.find('.pr-active'),
                variantElm = blockSticky.find('.pr-swatch');

            if(blockSticky.length) {
                var showHideVariantsOptions = function() {
                    sltVariantActive.off('click.showListVariant').on('click.showListVariant', function(e) {

                        e.preventDefault();

                        blockSticky.toggleClass('open-sticky');
                    }); 

                    doc.off('click.hideVariantsOption').on('click.hideVariantsOption', function(e) {
                        if (!sltVariantActive.is(e.target) && sltVariantActive.has(e.target).length === 0){
                            blockSticky.removeClass('open-sticky');
                        };
                    })
                };

                var handleActiveVariant = function() {
                    variantElm.off('click.activeVar').on('click.activeVar', function(e) {

                        var self = $(this),
                            text = self.text(),
                            value = self.data('value'),
                            title = self.data('title'),
                            newImage = self.data('img');


                        variantElm.removeClass('active');
                        self.addClass('active');
                        blockSticky.toggleClass('open-sticky');

                        blockSticky.find('.action input[type=hidden]').val(value);
                        sltVariantActive.attr('data-value', value).text(text);

                        var swatchNameValue = $('#add-to-cart-form [data-value-sticky="'+value+'"]');

                       

                        swatchNameValue.each(function() {
                            var slt = $(this).data('value');

                            $('[data-value="'+slt+'"]').closest('.swatch').find('#'+slt+'').click();
                        });

                        if(self.hasClass('sold-out')) {
                            blockSticky.find('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
                        }else {
                            blockSticky.find('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
                        };
    
                        $('.pr-img img').attr({ src: newImage }); 

                        return false;
                    });
                };

                var stickyAddToCart = function() {
                    doc.on('click', '[data-sticky-btn-addToCart]', function(e) {
                        e.preventDefault();

                        if($('#add-to-cart-form [data-btn-addToCart]').length) {
                            $('#add-to-cart-form [data-btn-addToCart]').click();     
                        } else if($('#add-to-cart-form [data-grouped-addToCart]').length) {
                            $('#add-to-cart-form [data-grouped-addToCart]').click();
                        };

                        return false;
                    });
                };

                var activeVariantSelected = function() {

                    var optionSelected = $('#product-selectors option:selected'),
                        value = optionSelected.val(),
                        stickyActive = blockSticky.find('.pr-swatch[data-value="'+value+'"]'),
                        stickyText = stickyActive.html();

                    sltVariantActive.html(stickyText);
                    stickyActive.addClass('active');

                    var str = stickyActive.data('img');

                    $('.pr-img img').attr({ src: str });

                    $(".swatch .swatch-element").each(function(e) {
                        var idVariant = $(this).find('input:radio').attr('id');

                        $('.swatch input.text[data-value="'+idVariant+'"]').appendTo($(this));
                    });

                    $('.selector-wrapper').change(function() {
                        var n = $("#product-selectors").val();

                        $('.sticky_form .pr-selectors li').each(function(e) {
                            var t = $(this).find('a').data('value');

                            if(t == n){
                                $(this).find('a').addClass('active')
                            } else{
                                $(this).find('a').removeClass('active')
                            }
                        });
                        
                        $("#product-selectors").change(function() {
                            var str = "";

                            $("#product-selectors option:selected").each(function() {
                                str += $(this).data('imge');
                            });

                            $('.pr-img img').attr({ src: str }); 
                        }).trigger("change");

                        if(variantElm.hasClass('active')) {
                            var h = $('.sticky_form .pr-swatch.active').html();

                            $('.sticky_form .action input[type=hidden]').val(n);
                            sltVariantActive.html(h);
                            sltVariantActive.attr('data-value', n);
                        };
                    });
                };

                var offSetTop = $('#add-to-cart-form .groups-btn').offset().top;

                $(window).scroll(function () {
                    var scrollTop = $(this).scrollTop();

                    if (scrollTop > offSetTop) {
                        body.addClass('show_sticky');
                    }
                    else {
                        body.removeClass('show_sticky');
                    }
                }); 

                showHideVariantsOptions();
                handleActiveVariant();
                stickyAddToCart();
                activeVariantSelected(); 
            };
        },

        createWishListTplItem: function(ProductHandle) {
            var wishListCotainer = $('[data-wishlist-container]');

            jQuery.getJSON(window.router + '/products/'+ProductHandle+'.js', function(product) {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
                productHTML += '<div class="inner product-item" data-product-id="product-'+product.handle+'">';
                productHTML += '<div class="column col-img"><div class="product-image">';
                productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
                productHTML += '<img data-srcset="'+product.featured_image+'" src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
                productHTML += '</a></div></div>';
                productHTML += '<div class="column col-prod">';
                productHTML += '<div class="product-vendor">';
                productHTML += '<a href="'+window.router+'/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div>';
                productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a></div>';
                productHTML += '<div class="column col-price text-center"><div class="price-box">'+ price_min +'</div></div>';
                productHTML += '<div class="column col-remove text-center"><a class="whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a></div>';
                productHTML += '<div class="column col-options text-center">';
                productHTML += '<form action="'+window.router+'/cart/add" method="post" class="variants" id="-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" data-form-id="#-'+product.id+'" >'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
                    } 
                    if (product.variants.length > 1){
                        productHTML += '<a class="btn" title="'+product.title+'" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
                    }
                } else {
                    productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
                }

                productHTML += '</form></div>';
                
                productHTML += '</div></div>';

                wishListCotainer.append(productHTML);
                var regex = /(<([^>]+)>)/ig;
                var href = $('.wrapper-wishlist a.share').attr("href");
                href += encodeURIComponent( product.title + '\nPrice: ' + price_min.replace(regex, "") + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + product.url +'\n\n');
                $('.wrapper-wishlist a.share').attr("href", href );
            });
        },

        initWishListPagging: function() {
            var data = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [0];

            var wlpaggingContainer = $('#wishlist-paginate');
            var paggingTpl = '<li class="text disabled prev"><a href="#" title="'+window.inventory_text.previous+'"><i class="fa fa-angle-left" aria-hidden="true"></i><span>'+window.inventory_text.previous+'</span></a></li>';
            var wishListCotainer = $('[data-wishlist-container]');
                
            wlpaggingContainer.children().remove();

            var totalPages = Math.ceil(data.length / 3);

            if (totalPages <= 1) {
                wishListCotainer.children().show();
                return;
            }

            for (var i = 0; i < totalPages; i++) {
                var pageNum = i + 1;
                if (i === 0) paggingTpl += '<li class="active"><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'                
                else paggingTpl += '<li><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'
            }

            paggingTpl += '<li class="text next"><a href="#" title="'+window.inventory_text.next+'"><span>'+window.inventory_text.next+'</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';

            wlpaggingContainer.append(paggingTpl);

            wishListCotainer.children().each(function(idx, elm) {
                if (idx >= 0 && idx < 3) {
                    $(elm).show();
                }
                else {
                    $(elm).hide();
                }
            });

            wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function(e) {
                e.preventDefault();

                var isPrev = $(this).parent().hasClass('prev');
                var isNext = $(this).parent().hasClass('next');
                var pageNumber = $(this).data('page');

                if (isPrev) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage - 1;
                }

                if (isNext) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage + 1;
                }

                wishListCotainer.children().each(function(idx, elm) {
                    if (idx >= (pageNumber - 1) * 3 && idx < pageNumber * 3) {
                        $(elm).show();
                    }
                    else {
                        $(elm).hide();
                    }
                });

                if (pageNumber === 1) {
                    wlpaggingContainer.find('.prev').addClass('disabled');
                    wlpaggingContainer.find('.next').removeClass('disabled');
                }
                else if (pageNumber === totalPages) {
                    wlpaggingContainer.find('.next').addClass('disabled');
                    wlpaggingContainer.find('.prev').removeClass('disabled');
                }
                else {
                    wlpaggingContainer.find('.prev').removeClass('disabled');
                    wlpaggingContainer.find('.next').removeClass('disabled');
                }

                $(this).parent().siblings('.active').removeClass('active');
                wlpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');

            });
        },

        initWishLists: function() {
            if (typeof(Storage) !== 'undefined') {               
                
                if (wishListsArr.length <= 0) {
                    return;
                }

                wishListsArr.forEach(function(item) {
                    cospora.createWishListTplItem(item);             
                });

                this.initWishListPagging();
                this.translateBlock('.wishlist-page');

            } else {
                alert('Sorry! No web storage support..');
            }
        },

        setAddedForWishlistIcon: function(ProductHandle) {    
            var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]'),
                idxArr = wishListsArr.indexOf(ProductHandle);

            if(idxArr >= 0) {
                wishlistElm.addClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            }
            else {
                wishlistElm.removeClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.add_wishlist);
            };
        },

        doAddOrRemoveWishlish: function() {            
            var iconWishListsSlt = '[data-icon-wishlist]';

            doc.off('click.addOrRemoveWishlist', iconWishListsSlt).on('click.addOrRemoveWishlist', iconWishListsSlt, function(e) {
                e.preventDefault();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('product-handle'),
                    idxArr = wishListsArr.indexOf(ProductHandle);
                
                if(!self.hasClass('whislist-added')) {
                    self.addClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.remove_wishlist);

                    if($('[data-wishlist-container]').length) {
                        cospora.createWishListTplItem(ProductHandle);
                    };

                    wishListsArr.push(ProductHandle);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

                } else {
                    self.removeClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.add_wishlist);

                    if($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                        $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                    }

                    wishListsArr.splice(idxArr, 1);
                    localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));

                    if($('[data-wishlist-container]').length) {
                        cospora.initWishListPagging();
                    };
                };

                cospora.setAddedForWishlistIcon(ProductHandle);
            });
        },

        initWishListIcons: function() {            

            if (!wishListsArr.length) {
                return;
            }
   
            for (var i = 0; i < wishListsArr.length; i++) {
                var icon = $('[data-product-handle="'+ wishListsArr[i] +'"]');
                icon.addClass('whislist-added');
                icon.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            };

            if (typeof(Storage) !== 'undefined') {        
                    
                if (wishListsArr.length <= 0) {
                    return;
                }

                setTimeout(function() {
                    wishListsArr.forEach(function(item) {
                        cospora.setAddedForWishlistIcon(item);     
                    });
                },1500);

            } else {
                alert('Sorry! No web storage support..');
            }

        },
        
        setAddedForCompareIcon: function(ProductHandle) {    
            var compareElm = $('[data-compare-product-handle="'+ ProductHandle +'"]'),
                idxArr = compareArr.indexOf(ProductHandle),
                compareCountNum = $('[data-compare-count]');

                compareItems = localStorage.getItem('compareArr') ? JSON.parse(localStorage.getItem('compareArr')) : [];
                totalProduct = Math.ceil(compareItems.length);

            if(idxArr >= 0) {
                compareElm.addClass('compare-added');
                compareElm.find('.compare-text').text(window.inventory_text.remove_compare);
            }
            else {
                compareElm.removeClass('compare-added');
                compareElm.find('.compare-text').text(window.inventory_text.add_compare);
            };

            compareCountNum.text(totalProduct);

            if(totalProduct >=2){
                $('.compare-link').addClass('open');
            }else{
                $('.compare-link').removeClass('open');
            }
        },

        doAddOrRemoveCompare: function() {            
            var iconCompare = '[data-icon-compare]';

            doc.off('click.doAddOrRemoveCompare', iconCompare).on('click.doAddOrRemoveCompare', iconCompare, function(e) {
                e.preventDefault();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('compare-product-handle'),
                    idxArr = compareArr.indexOf(ProductHandle);
                if(!self.hasClass('compare-added')) {
                    self.find('.compare-text').text(window.inventory_text.remove_compare);


                    compareArr.push(ProductHandle);
                    localStorage.setItem('compareArr', JSON.stringify(compareArr));

                    cospora.createCompareItem(ProductHandle);
                    self.addClass('compare-added');

                } else {
                    self.removeClass('compare-added');
                    self.find('.compare-text').text(window.inventory_text.add_to_compare);
                    if($('[data-compare-added="compare-'+productId+'"]').length) {
                        $('[data-compare-added="compare-'+productId+'"]').remove();
                    }

                    compareArr.splice(idxArr, 1);
                    localStorage.setItem('compareArr', JSON.stringify(compareArr));
                };

                cospora.setAddedForCompareIcon(ProductHandle);
            });

        },

        initCompareIcons: function() {       
            
            var compareCountNum = $('[data-compare-count]');
                
                totalProduct = Math.ceil(compareArr.length);
                compareCountNum.text(totalProduct);

            if (!compareArr.length) {
                return;
            } else {

                for (var i = 0; i < compareArr.length; i++) {
                    var icon = $('[data-compare-product-handle="'+ compareArr[i] +'"]');
                    icon.addClass('compare-added');
                    icon.find('.compare-text').text(window.inventory_text.remove_compare);
                };

                if (typeof(Storage) !== 'undefined') {        
                    
                    if (compareArr.length <= 0) {
                        return;
                    }

                    setTimeout(function() {
                        compareArr.forEach(function(item) {
                            cospora.createCompareItem(item);
                            cospora.setAddedForCompareIcon(item);      
                        });
                    },1500);
                    

                } else {
                    alert('Sorry! No web storage support..');
                }

            }
        },

        initCompareSelected: function() {
            var iconCompareSelected = '[data-compare-selected]';
                compareModal = $('[data-compare-modal]');
                compareModalProduct = compareModal.find('.product-grid');
                compareModalMessage = $('[data-compare-message-modal]');

            doc.off('click.compareSelected', iconCompareSelected).on('click.compareSelected', iconCompareSelected, function(e) {
                e.preventDefault();
                e.stopPropagation();                

                if (typeof(Storage) !== 'undefined') {        
                    
                    if (compareArr.length <= 1) {
                        compareModalMessage.find('.halo-modal-body').text(window.inventory_text.message_compare);
                        compareModalMessage.fadeIn(500, function () {
                            html.addClass('halo-modal-open');
                        });

                        body.addClass('has-popup');

                    } else {
                        compareArr.forEach(function(item) {
                            cospora.removeCompareItem(item);
                        });

                        compareModal.fadeIn(600, function () {
                            html.addClass('halo-modal-open');
                        });

                        cospora.removeAllCompareItem();
                    }                    

                } else {
                    alert('Sorry! No web storage support..');
                }

                cospora.closeSuccessModal();
                cospora.translateBlock('.ajax-compare');
                cospora.translateBlock('.compare-message-modal');
            });
        },

        createCompareItem: function(ProductHandle) {
            var compareProduct = $('[data-compare-modal]').find('.halo-modal-body .compare-content .product-grid'),
                compareRating = $('[data-compare-modal]').find('.halo-modal-body .compare-content .rating'),
                compareDescription = $('[data-compare-modal]').find('.halo-modal-body .compare-content .description'),
                compareCollection = $('[data-compare-modal]').find('.halo-modal-body .compare-content .collection'),
                compareAvailability = $('[data-compare-modal]').find('.halo-modal-body .compare-content .availability'),
                compareProductType = $('[data-compare-modal]').find('.halo-modal-body .compare-content .product-type'),

                compareSKU = $('[data-compare-modal]').find('.halo-modal-body .compare-content .product-sku'),
                compareOption1 = $('[data-compare-modal]').find('.option1'),
                compareOption2 = $('[data-compare-modal]').find('.option2'),
                compareOption3 = $('[data-compare-modal]').find('.option3');


            jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
                console.log(product);
                var productHTML = '',
                    priceHTML = '',
                    productLabelHTML = '',
                    ratingHTML = '',
                    descriptionHTML = '',
                    collectionHTML = '',
                    availabilityHTML = '',
                    productTypeHTML = '',
                    skuHTML = '',
                    optionValueHTML = '',
                    optionValueHTML2 = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                var productIDCompare = product.id;
                    
               // Rating
               var rating = '<span class="shopify-product-reviews-badge" data-id="'+productIDCompare+'"></span>';
               // Description
               var desc =  product.description.substring(0,100) + '...',
               domparser = new DOMParser(),
               descriptionHTML = domparser.parseFromString(desc, "text/html");
               // Label
               var labelSale = (( product.variants[0].compare_at_price - product.variants[0].price )/ product.variants[0].compare_at_price) * 100,
               arrayTags = product.tags,
               percentDiscount = Math.floor(labelSale);



                // Option
                var productOptions = product.options;
              
                $.each(productOptions, function(index, opt) {
                    var optPosition = opt.position,
                        optName = opt.name.toLowerCase(),
                        optValue = opt.values,
                        optValueText = '';

                    optValue.forEach(function(value, index) {
                        if (value) {
                            if (index > 0) {
                                optValueText += ', '
                            }
                            optValueText += value;
                        }
                    })

                    optionValueHTML2 += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">-</div>';

                    if (optValueText == '' || optValueText == 'Default Title') {
                        optionValueHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">-</div>';
                    } else {
                        optionValueHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">'+optValueText+'</div>';
                    }

                    var optionOneValue = window.option_ptoduct1,
                        optionTwoValue = window.option_ptoduct2;
                        optionThreeValue = window.option_ptoduct3;
                    if (optPosition == 1) {
                        if (optName == optionOneValue) {
                            compareOption1.append(optionValueHTML);
                            compareOption2.append(optionValueHTML2);
                            compareOption3.append(optionValueHTML2);
                        } else if (optName == optionTwoValue) {
                            compareOption1.append(optionValueHTML2);
                            compareOption2.append(optionValueHTML);
                            compareOption3.append(optionValueHTML2);
                        } else if (optName == 'title') {
                            compareOption1.append(optionValueHTML2);
                            compareOption2.append(optionValueHTML2);
                            compareOption3.append(optionValueHTML2);
                        } else {
                            compareOption1.append(optionValueHTML2);
                            compareOption2.append(optionValueHTML2);
                            compareOption3.append(optionValueHTML);
                        }
                    }
                    if (optPosition == 2) {
                        if (optName == optionOneValue) {
                            compareOption1.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                        } else  if (optName == optionTwoValue) {
                            compareOption2.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                        } else {
                            compareOption3.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                        }
                    }
                    if (optPosition == 3) {
                        if (optName == optionOneValue) {
                            compareOption1.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                        } else  if (optName == optionTwoValue) {
                            compareOption2.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                        } else {
                            compareOption3.find('[data-compare-added="compare-'+product.id+'"]').html(optValueText);
                        }
                    }
                });

                
                if (rating == '' || rating == undefined) {
                    ratingHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'"></div>';
                } else {
                    ratingHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">'+rating+'</div>';
                }                        
                compareRating.append(ratingHTML);
               
               
               if (desc == '' || desc == undefined ) {
                    descriptionHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">-</div>';
                
               } else {
                    descriptionHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">'+desc+'</div>';
               }
               compareDescription.append(descriptionHTML);


               var sku = product.variants;

               if (sku.length > 1) {
                    $.each( sku, function( key, value ) {
                        if(key == 0){
                            skuValue = value.sku;
                            if(skuValue == ""){
                               skuValueHTML = '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">-</div>';
                               skuHTML += skuValueHTML;
                            }
                            else{
                                skuValueHTML = '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">'+skuValue+'</div>';
                                skuHTML += skuValueHTML;
                            }
                        }
                    });
               } else {
                skuHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">-</div>';
               }

               compareSKU.append(skuHTML);
              
                       

                productHTML += '<div class="grid-item col-xl-3 product-item" data-compare-added="compare-'+product.id+'">';
                productHTML += '<div class="inner" data-product-id="product-'+product.handle+'"><div class="inner-top"';
                productHTML += '<div class="product-top"><div class="product-image">';
                productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
                productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
                productHTML += '</a></div>';

                productHTML += '<div class="product-label">';
                if(product.compare_at_price > product.price){
                    if(window.label_sale == 'label_sale'){
                        productHTML += '<strong class="label sale-label">'+ window.inventory_text.salelabel +' </strong>';
                        productHTML += '<br>';
                    }else{
                        productHTML += '<strong class="label sale-label">- '+percentDiscount+'% </strong>';
                        productHTML += '<br>';
                    }
                }
                if (product.available == false) {
                    productHTML += '<strong class="label sold-out-label">'+ window.inventory_text.soldoutlabel +' </strong>';
                    productHTML += '<br>';
                }
                
                arrayTags.forEach(function(element){
                    if(element == 'new'){
                      productHTML += '<strong class="label new-label">'+ window.inventory_text.newlabel +' </strong>';
                      productHTML += '<br>';
                    }
                    if(element == 'Custom Label'){
                      productHTML += '<strong class="label custom-label">'+ window.inventory_text.customlabel +' </strong>';
                      productHTML += '<br>';
                    }
                    if(element == 'bundle') {
                      productHTML += '<strong class="label bundle-label">'+ window.inventory_text.bundlelabel +' </strong>';
                      productHTML += '<br>';
                    }
                })

                productHTML += '</div></div></div>';
                productHTML += '<div class="product-bottom">';
                productHTML += '<div class="product-vendor">';
                productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div>';
                productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a>';
                productHTML += '<div class="column col-price text-center"><div class="price-box">';
                if(product.compare_at_price > product.price){
                  productHTML += '<span class="price-sale">';
                    productHTML += '<span class="old-price">' + Shopify.formatMoney(product.variants[0].compare_at_price  , window.money_format) + '</span>';
                    productHTML += '<span class="price special-price" itemprop="price"> '+ Shopify.formatMoney(product.price, window.money_format)+'</span>';
                    productHTML +='</span>';
                }else{
                    productHTML += '<span> '+ Shopify.formatMoney(product.price, window.money_format)+'</span>';
                }
                productHTML += '</div></div>';
                
                productHTML += '<div class="column col-options text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" id="-'+product.id+'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" data-form-id="#-'+product.id+'" >'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />'; 
                    } 
                    if (product.variants.length > 1){
                        productHTML += '<a class="btn" title="'+product.title+'" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
                    }
                    availabilityHTML += '<div class="col-xl-3 in-stock" data-compare-added="compare-'+product.id+'">'+window.inventory_text.in_stock+'</div>';
                } else { 
                    productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
                    availabilityHTML += '<div class="col-xl-3 unavailable" data-compare-added="compare-'+product.id+'">'+window.inventory_text.unavailable+'</div>';
                }

                productHTML += '</form></div>';
                productHTML += '<div class="column col-remove text-center"><a class="compare-added" href="#" data-icon-compare-added data-compare-product-handle="'+ product.handle +'" data-id="'+ product.id +'">'+window.inventory_text.remove+'</a></div></div>';
                
                productHTML += '</div></div></div>';

                compareProduct.append(productHTML);

                productTypeHTML += '<div class="col-xl-3" data-compare-added="compare-'+product.id+'">'+product.type+'</div>';    

                compareAvailability.append(availabilityHTML);
                compareProductType.append(productTypeHTML);
                if ($(".spr-badge").length > 0) {
                  return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                }     
            });
        },

        removeCompareItem: function(ProductHandle) {
            var iconCompareRemove = '[data-icon-compare-added]';

            doc.off('click.removeCompareItem', iconCompareRemove).on('click.removeCompareItem', iconCompareRemove, function(e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('compare-product-handle'),
                    idxArr = compareArr.indexOf(ProductHandle);
                
                if($('[data-compare-added="compare-'+productId+'"]').length) {
                    $('[data-compare-added="compare-'+productId+'"]').remove();

                }

                compareArr.splice(idxArr, 1);
                localStorage.setItem('compareArr', JSON.stringify(compareArr));

                cospora.setAddedForCompareIcon(ProductHandle);
            });
        },

        removeAllCompareItem: function(ProductHandle) {
            var compareRemoveAll = '[data-compare-remove-all]';
                compareCountNum = $('[data-compare-count]');
                compareElm = $('[data-icon-compare]');

            doc.off('click.removeAllCompareItem', compareRemoveAll).on('click.removeAllCompareItem', compareRemoveAll, function(e) {
                e.preventDefault();
                e.stopPropagation();

                 $('[data-compare-added]').remove();

                 compareArr.splice(0,compareArr.length);
                 localStorage.setItem('compareArr', JSON.stringify(compareArr));

                 if (compareElm.hasClass('compare-added')) {
                    compareElm.removeClass('compare-added');
                    compareElm.find('.compare-text').text(window.inventory_text.add_compare);
                 }

                 $('.compare-link').removeClass('open');

                 totalProduct = Math.ceil(compareArr.length);
                 compareCountNum.text(totalProduct);
            })
        },

        InitsidebarFilter: function(){
          $(document).on('click', '.halo-fillter', function(){
            $('html').toggleClass('filter-open');

            $('.wrap-overlay, .close-filter a').on('click', function(){
              $('html').removeClass('filter-open');
            });

          });
        },

        initCollectionPagging: function() {
            var data = JSON.parse(localStorage.getItem('items'));

            var collectionpaggingContainer = $('#collection-paginate');
            var paggingTpl = '<li class="text disabled prev"><a href="#" title="'+window.inventory_text.previous+'"><i class="fa fa-angle-left" aria-hidden="true"></i><span>'+window.inventory_text.previous+'</span></a></li>';
            var collectionContainer = $('[data-collection-container]');
                
            collectionpaggingContainer.children().remove();

            var totalCollection = $('.list-collection .grid-item').size();
            var totalPages = Math.ceil(totalCollection / 12);

            if (totalPages <= 1) {
                return;
            }

            for (var i = 0; i < totalPages; i++) {
                var pageNum = i + 1;
                if (i === 0) paggingTpl += '<li class="active"><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'                
                else paggingTpl += '<li><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'"><span>' + pageNum + '</span></a></li>'
            }

            paggingTpl += '<li class="text next"><a href="#" title="'+window.inventory_text.next+'"><span>'+window.inventory_text.next+'</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';

            collectionpaggingContainer.append(paggingTpl);

            collectionContainer.children().each(function(idx, elm) {
                if (idx >= 0 && idx < 12) {
                    $(elm).show();
                }
                else {
                    $(elm).hide();
                }
            });

            collectionpaggingContainer.off('click.coll-pagging').on('click.coll-pagging', 'li a', function(e) {
                e.preventDefault();

                var isPrev = $(this).parent().hasClass('prev');
                var isNext = $(this).parent().hasClass('next');
                var pageNumber = $(this).data('page');

                if (isPrev) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage - 1;
                }

                if (isNext) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage + 1;
                }

                collectionContainer.children().each(function(idx, elm) {
                    if (idx >= (pageNumber - 1) * 12 && idx < pageNumber * 12) {
                        $(elm).show();
                    }
                    else {
                        $(elm).hide();
                    }
                });

                if (pageNumber === 1) {
                    collectionpaggingContainer.find('.prev').addClass('disabled');
                    collectionpaggingContainer.find('.next').removeClass('disabled');
                }
                else if (pageNumber === totalPages) {
                    collectionpaggingContainer.find('.next').addClass('disabled');
                    collectionpaggingContainer.find('.prev').removeClass('disabled');
                }
                else {
                    collectionpaggingContainer.find('.prev').removeClass('disabled');
                    collectionpaggingContainer.find('.next').removeClass('disabled');
                }

                $(this).parent().siblings('.active').removeClass('active');
                collectionpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');

            });
        },

        showModalError: function(selector){
          $(selector).fadeIn(500);

          lynkco.lynkcoTimeout = setTimeout(function() {
            $(selector).fadeOut(500);
          }, 5000);

          $(document).on('click touchstart', function(){
            $(selector).fadeOut(500);
          });
        },

        initBundleProducts: function() {

            var btnAddToCartSlt = '[data-bundle-addToCart]',
                bundleImagesSlide = $('[data-bundle-images-slider]'),
                btnToggleOptionsSlt = '.fbt-toogle-options',
                bundlePrice = $('.products-grouped-action .bundle-price'),
                bundleCheckbox = '.bundle-checkbox';

            var replaceDiscountRate = function(){
                if(bundlePrice.length > 0){
                    var discountRate = bundlePrice.data('discount-rate')*100;
                    var discountText = $('.products-grouped-action .discount-text span');
                    if(discountText.length > 0){
                        discountText.each(function(){
                            $(this).text($(this).text().replace('[discount]',discountRate)).parent().show();
                        })
                    }

                }
            }

            var bundleSlider = function() {
                if(bundleImagesSlide.length && bundleImagesSlide.not('.slick-initialized')) {
                    var images = bundleImagesSlide.data('rows');

                    bundleImagesSlide.slick({
                        get slidesToShow() {
                            if(images >= 6) {
                                return this.slidesToShow = 6;
                            }
                            else {
                                return this.slidesToShow = images;
                            }
                        },
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [{
                                breakpoint: 992,
                                settings: {
                                    get slidesToShow() {
                                        if(images >= 4) {
                                            return this.slidesToShow = 4;
                                        }
                                        else {
                                            return this.slidesToShow = images;
                                        }
                                    },
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    get slidesToShow() {
                                        if(images > 3) {
                                            return this.slidesToShow = 3;
                                        }
                                        else {
                                            return this.slidesToShow = images;
                                        }
                                    }
                                }
                            }
                        ]
                    });
                }
            };

            var toggleVariantOptions = function() {
                body.off('click.toggleVariantOptions', btnToggleOptionsSlt).on('click.toggleVariantOptions', btnToggleOptionsSlt, function(e) {
                    e.preventDefault();

                    $(this).next().slideToggle();
                })
            };

            var handleCheckedProduct = function() {
                // check all checkbox on loadpage
                $('.fbt-checkbox input').prop('checked',true);

                body.off('click.checkedProduct', bundleCheckbox).on('click.checkedProduct', bundleCheckbox, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        ipt = self.prev(),
                        dataId = self.closest('.fbt-product-item').data('bundle-product-id');

                    if(!ipt.prop('checked')) {
                        ipt.prop('checked', true);
                        $('[data-bundle-product-id="'+ dataId +'"]').addClass('isChecked');
                    } else {
                        ipt.prop('checked', false);

                        $('[data-bundle-product-id="'+ dataId +'"]').removeClass('isChecked');
                    };
                    updateTotalPrice();
                })
            };

            var initSelectedSwatch = function() {
                $('.fbt-product-item').each(function() {
                    var self = $(this);
                    var productId = self.data('bundle-product-id');
                    var selectedVariantId = $(this).find('[name="group_id"]').val();
                    var productOpts = self.find('.swatch');
                    var variantArr = window.productVariants[productId];

                    if (!variantArr) {
                        return;
                    }
                    // Get selected variant
                    var selectedVariant = variantArr.find(function(variant){
                        return variant.id == selectedVariantId
                    });

                    // Check selected swatch
                    productOpts.each(function(index){
                        var optionIndex = 'option' + (index + 1);
                        var selectedSwatch = $(this).find('.swatch-element[data-value="'+selectedVariant[optionIndex]+'"]');

                        selectedSwatch.find('input').prop('checked', true);
                    })

                });

            }

            var updateTotalPrice = function() {
                var bundleProItem = $('.fbt-product-item.isChecked');
                var bundlePrice = $('.products-grouped-action .bundle-price');
                var oldPrice = $('.products-grouped-action .old-price');
                var discountRate = bundlePrice.data('discount-rate');
                var totalPrice = 0;
                var checkedProductLength = $('.fbt-product-item.isChecked').length;
                var maxProduct = $('.fbt-product-item').length;

                bundleProItem.each(function() {
                    var selectElm = $(this).find('select[name=group_id]'),
                        inputElm = $(this).find('input[name=group_id]');

                    if(selectElm.length) {
                        var price = selectElm.find(':selected').data('price');
                    } else {
                      if (inputElm.length) {
                        var price = $(this).find('input[name=group_id]').data('price');
                      } else {
                        var price = $(this).find('input[name=id]').data('price');
                      }
                    }

                    if(price) {
                        totalPrice += price;

                        if(bundlePrice.length > 0 && oldPrice.length > 0){
                            oldPrice.html(Shopify.formatMoney(totalPrice, window.money_format));
                            bundlePrice.html(Shopify.formatMoney(totalPrice*(1 - discountRate), window.money_format));
                             if(checkedProductLength == maxProduct){
                                window.bundleMatch = true;
                                bundlePrice.show();
                                oldPrice.show();
                                $('.products-grouped-action .price').hide();
                            }else{
                                window.bundleMatch = false;
                                bundlePrice.hide();
                                oldPrice.hide();
                                $('.products-grouped-action .price').show();
                            }
                        }

                        $('.products-grouped-action .total .price').html(Shopify.formatMoney(totalPrice, window.money_format));


                    };
                })
                if (cospora.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            };

            var disableSoldoutSwatchAllBundles = function(){
                var productItem = $('.fbt-product-item');
                productItem.each(function(){
                    var self = $(this);
                    disableSoldoutSwatchBundle(self);
                })
            };

            var disableSoldoutSwatchBundle = function(productItem){
                var productId = productItem.data('bundle-product-id');
                var variantList = window.productVariants[productId];
                var options = productItem.find('[data-option-idx]');
                var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();

                options.each(function(){
                    var optionIndex = $(this).data('option-idx');
                    var swatch = $(this).find('.swatch-element');
                    switch (optionIndex) {
                        case 0:
                        // loop through all swatchs in option 1 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 1:
                        // loop through all swatchs in option 2 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 2:
                        // loop through all swatchs in option 3 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                    }
                });
            };

            var changeSwatchProductBundle = function() {
                var swatchSlt = '.fbt-product-item .swatch :radio';

                doc.off('change.changeBundleSwatch', swatchSlt).on('change.changeBundleSwatch', swatchSlt, function(e) {
                    var self = $(this);
                    if (self.prop('checked')) {
                        var productItem = $(this).closest('.fbt-product-item');
                        var productId = productItem.data('bundle-product-id');
                        var variantList = window.productVariants[productId];
                        var optionIdx = self.closest('[data-option-idx]').data('option-idx');
                        var swatches = productItem.find('.swatch-element');
                        var thisVal = self.val();
                        var selectedVariant;
                        var fbtPrice = productItem.find('.fbt-prices'),
                            priceSale = fbtPrice.find('.price-sale'),
                            productPrice = fbtPrice.find('[data-fbt-price-change]');
                        var productInput = productItem.find('[name=group_id]');
                        // Get selected swatches
                        var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                        var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                        var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();
                        // Re-active all swatches
                        swatches.removeClass('soldout');
                        swatches.find(':radio').prop('disabled',false);
                        // Auto get first available variant
                        switch (optionIdx){
                            case 0:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == thisVal && variant.option2 == selectedSwatchOpt2 && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                     // variant was sold out, so auto select other available variant
                                    var altAvailableVariants = variantList.find(function(variant){
                                        return variant.option1 == thisVal && variant.available;
                                    })
                                    selectedVariant =  altAvailableVariants;
                                };
                                break;
                            case 1:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #2')
                                };
                                break;
                            case 2:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                   selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #3')
                                };
                                break;
                        }

                        productInput.val(selectedVariant.id);

                        // Check new swatch input
                        initSelectedSwatch();
                        // Disable sold out swatches base on new checked inputs
                        disableSoldoutSwatchBundle(productItem);

                        // Do select callback function
                         productPrice.html(Shopify.formatMoney(selectedVariant.price, window.money_format));

                         // change variant id of main product for adding to cart
                         productItem.find('input[name=id][type=hidden]').val(selectedVariant.id)

                            if (selectedVariant.compare_at_price > selectedVariant.price) {
                                priceSale.find('[data-fbt-price-change]').addClass('special-price');
                                priceSale.find('.old-price').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format)).show();
                            }
                            else {
                                priceSale.find('.old-price').hide();
                                priceSale.find('[data-fbt-price-change]').removeClass('special-price');
                            }

                            productItem.find('select').val(selectedVariant.id).trigger('change');

                            updateTotalPrice();
        
                              if (cospora.checkNeedToConvertCurrency()) {
                                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            }

                            // Change product image
                            var newImage = productInput.find('option:selected',this).attr('data-image');
                            if(newImage != undefined){
                                var productImage = $('.fbt-image-item[data-bundle-product-id="'+productId+'"]').find('img');
                                productImage.attr('src',newImage)
                            }

                            // Change varriant name List
                            productItem.attr('data-bdopt1', selectedVariant.option1 );
                            productItem.attr('data-bdopt2', selectedVariant.option2 );
                            productItem.attr('data-bdopt3', selectedVariant.option3 );

                    }
                });
            };

            var initBundleAddToCart = function() {

                doc.off('click.bundleAddToCart', btnAddToCartSlt).on('click.bundleAddToCart', btnAddToCartSlt, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        form = self.closest('form'),
                        curPro = form.find('[data-collections-related]'),
                        handle = curPro.data('collections-related'),
                        bundleProduct = form.find('[data-grouped-product-item].isChecked'),
                        mainProduct = form.find('.main-pr-bd'),
                        title = $('h1.product-title').text(),
                        image = $('[id^="product-featured-image"]').first().attr('src');
                        var valueOpt1 = mainProduct.attr('data-bdopt1');
                        var valueOpt2 = mainProduct.attr('data-bdopt2');
                        var valueOpt3 = mainProduct.attr('data-bdopt3');
                        var variant =     '';
                        variant = variant + valueOpt1;
                        variant = valueOpt2 ? variant + ' / ' + valueOpt2 : variant;
                        variant = valueOpt3 ? variant + ' / ' + valueOpt3 : variant;

                    if(self.attr('disabled') !== "disabled") {
                        cospora.showLoading();
                        Shopify.queue = [];
                        var i = 0;

                        //  Add Item List Bundle
                        var bPData = [];
                        bundleProduct.each(function(index) {
                            var variantId = $(this).find('[name=group_id]').val();

                            if(variantId) {
                              var thisTitle = $(this).find('.product-title').text().trim();
                              var thisImage = $(this).data('bd-image');
                                var thisOpt1 = $(this).data('bdopt1');
                                var thisOpt2 = $(this).data('bdopt2');
                                var thisOpt3 = $(this).data('bdopt3');
                                var thisVariant =     '';
                                thisVariant = thisVariant + thisOpt1;
                                thisVariant = thisOpt2 ? thisVariant + ' / ' + thisOpt2 : thisVariant;
                                thisVariant = thisOpt3 ? thisVariant + ' / ' + thisOpt3 : thisVariant;

                                bPData.push({
                                  title: thisTitle,
                                  image: thisImage,
                                  variant: thisVariant
                                })
                                Shopify.queue.push( {
                                    variantId: variantId,
                                    quantity: 1
                                });

                            };
                        });

                        Shopify.moveAlong = function() {
                            if (Shopify.queue.length) {
                                var request = Shopify.queue.shift();
                                cospora.showLoading();
                                Shopify.addItem(request.variantId, request.quantity, Shopify.moveAlong);
                                cospora.cosporaTimeout = setTimeout(function(){
                                    cospora.hideLoading();
                                },5000)
                            }
                            else {
                                cospora.hideLoading();
                                var variant_id = curPro.find('[name=id]').val();
                                var formData = $(self.data('form-id'));
                                var data = formData.serialize();
                                var quantity = 1;
                                switch (window.ajax_cart) {
                                    case "none":
                                        cospora.doAjaxAddToCart(data, handle,true);
                                        break;

                                    case "normal":
                                        cospora.doAjaxAddToCartNormal(data, title,image, variant, bPData);
                                        break;

                                    case "upsell":
                                        cospora.doAjaxAddToCart(data, handle);
                                        break;
                                };
                             
                                // add discount code first
                                try{
                                    var discount_code = "FBT-BUNDLE-"+ meta.product.id;
                                    cospora.apply_discount( discount_code );
                                }
                                catch(e){
                                    console.log(e)
                                }
                                return false;
                            };
                        }

                        Shopify.moveAlong();

                    }

                });

                 
            };
            replaceDiscountRate();
            bundleSlider();
            toggleVariantOptions();
            handleCheckedProduct();
            initSelectedSwatch();
            disableSoldoutSwatchAllBundles();
            changeSwatchProductBundle();
            updateTotalPrice();
            initBundleAddToCart();
        },

        apply_discount: function( discount_code ){
            if(window.bundleMatch){
                $.ajax({
                    url: "/discount/" + discount_code,
                    success: function(response){
                        console.log('Discount code added');
                    }
                });
            }

        },

        productRecomendation: function() {
          var $container = $('.js-product-recomendation');
          var productId = $container.data('productId');
          var sectionId = $container.data('sectionId');
          var limit = $container.data('limit');
          var productRecommendationsUrlAndContainerClass = window.router +
              '/recommendations/products?&section_id='+ sectionId +'&limit=' + limit + '&product_id=' + productId + ' .product-recommendations';
          $container.parent().load(productRecommendationsUrlAndContainerClass, function(){
            cospora.initSliderRelatedProducts();
            cospora.translateBlock('#product-recommendations');
          } );  
        },

        appendProductRecomendation: function(){
          var ProductRecomendation = $('#product-recommendations'),
              appenRecomendation = $('.template-product .product .product_bottom');
              ProductRecomendation.appendTo(appenRecomendation);


        },
        
        hide_filter: function(){
          $(".sidebar-tags .widget-content ul").each(function() {   
            if ($(this).children('li').length > 0) {
              $(this).parents('.sidebar-tags').show();
            } else { 
              $(this).parents('.sidebar-tags').hide();
            }
          });
        },

        checkbox_checkout: function(){
            var inputWrapper = $('.checkbox-group label');

            var checkBox = $('.checkbox-group input[type="checkbox"]');

            checkBox.each(function() {
                if ($(this).is(':checked')) {
                    $(this).parent().parent().find('.btn-checkout').removeClass('show');
                } else {
                    $(this).parent().parent().find('.btn-checkout').addClass('show');
                }
            });

            inputWrapper.off('click').on('click', function (e) {
                var inputTrigger= $(this).parent().find('.conditions'),
                    divAddClassbtn = $(this).parent().parent().find('.btn-checkout');

                if (!inputTrigger.is(':checked')) {
                    divAddClassbtn.removeClass('show');
                    inputTrigger.prop('checked', true);
                } else {
                    divAddClassbtn.addClass('show');
                    inputTrigger.prop('checked', false);
                }

            });
        },

        changeSelectValue: function(){
            var selectList = $('.swap-el_drd'),
                selectItem = selectList.find('li input[type="radio"]'),
                enableDropdown = selectList.find('ul'),
                selectListLabel = selectList.find('label.swap-el_drd-label');
            
            selectListLabel.off('click.showSellect').on('click.showSellect' , function(e) {
              var selectItemClick =  $(this).parent();
              if(selectItemClick.hasClass("is_open")){
                  selectItemClick.removeClass("is_open");
              }else{
                  selectItemClick.addClass("is_open");
              }
              
            });    
            

            selectItem.on('change', function(){
              if($(this).is(':checked')){
                var thisValue = $(this).next('label').text();
                selectListLabel.text(thisValue);
              }
            })
        }
        
    };

})(jQuery);