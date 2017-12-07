$(document).ready(function () {

    function setClickOutside(container, func) {
        $(document).on('touchstart click', function(e) {
            var target = $(e.target);
            
            if ( target.is('.overlay') ) {
                if( container.is('.visible') ) {
                    container.removeClass('visible');
                    func();
                }
            }
        });
    }
    
    function freezeBody() {
        $('html, body').addClass('no-scroll');
    }
    
    function unfreezeBody() {
        $('html, body').removeClass('no-scroll');
    }

    function setPaginationNext(item) {
        var $url = item.attr('data-path');
        if ( !$url ) { return; }
        else {
            var $arr = $url.split('/'),
            $page = parseInt( $arr[$arr.length - 1] );
            if( !$page ) { return; }
            else {
                $page++;
                var $regexItem = '/\\d',
                $nameRegexp = new RegExp( $regexItem, 'g' );
                $url = $url.replace( $nameRegexp, '/' + $page );
                $obj.attr('data-path',$url);
            }
        }
    }

    $('.bag-payment-bonus-button').on( 'click', function() {
        var button = $(this);

        $.ajax( {
            url: '',
            data: '',
            success: function() {
                button.siblings().not('.bag-table-payment-bonus-text').remove();
                button.next('.bag-table-payment-bonus-text').addClass('visible');
                button.remove();
            }
        } );
    } );

    if ( $('.validate-form').length ) {
        $('.validate-form').each( function() {
            $(this).validate();
        } );
    }

    $.validator.addMethod("phoneValidation", function (phone, element) {
            var regex = /^\d{10}$/;
            return regex.test(phone);
        },
        "Введите валидный номер телефона");

    $.validator.addMethod("myEmail", $.validator.methods.email, "Введите валидный email");

    $.validator.addMethod("myNameRequired", $.validator.methods.required, "Введите ваше имя");

    $.validator.addMethod("myMessageRequired", $.validator.methods.required, "Введите текст сообщения");

    $.validator.addClassRules( {
        'email-field': {
            myEmail: true
        },
        'phone-field': {
            phoneValidation: true
        },
        'name-field': {
            myNameRequired: true
        },
        'message-field': {
            myMessageRequired: true
        }
    } );

   $('body').on( 'click ','#swipebox-slider .current', function(e) {
        var target = $(e.target);
        if ( target.is('img') ) {
            e.preventDefault();
        }
        else {
            $('#swipebox-close').trigger('click');
        }
    } );
   
    /*function TopMenuBag() {
        var bag = $('.top-menu-bag-wrapper'),
            openBtn = $('.top-menu-action .top-menu-bag'),
            overlay = $('.overlay');

        var init = function () {
            openBtn.on('click', btnClickHandler);

            $('.wrapper').on('touchstart', function () {
                $('.wrapper').swipe({
                        swipeRight: function () {
                            if ( bag.is('.visible') ) {
                                closeBag();
                            }
                        }
                    }
                );
            });

            setClickOutside(bag, closeBag);
            bag.find('.top-menu-bag-close-wrapper').on('click', closeBag);
        };

        function btnClickHandler() {
            if ( bag.is('.visible') ) {
                closeBag();
            }
            else {
                openBag();
            }
        }
        
        function openBag() {
            leftMenu.closeAll();
            topMenuLists.closeMenu();

            bag.addClass('visible');
            openBtn.addClass('selected');
            overlay.addClass('visible');

            freezeBody();
        }

        var closeBag = function () {
            bag.removeClass('visible');
            openBtn.removeClass('selected');

            overlay.removeClass('visible');

            unfreezeBody();
        };

        return {
            init: init,
            closeBag: closeBag
        };
    }
    if ( $('.top-menu-bag-wrapper').length ) {
        var topMenuBag = TopMenuBag();
        topMenuBag.init();
    }*/

    function TopMenuLists() {
        var lists = $('.top-menu-lists-wrapper'),
        openBtn = $('.lists-open-wrapper'),
        overlay = $('.overlay');

        var init = function () {
            openBtn.click(btnClickHndlr);

            $('.wrapper').on( 'touchstart', function () {
                $('.wrapper').swipe({
                    swipeLeft: function () {
                        if ( lists.is('.visible') ) {
                            closeMenu();
                        }
                    }
                }
                );
            } );

            setClickOutside(lists, closeMenu);

            lists.on('click', '.has-submenu', function (e) {
                var target = $(e.target);
                if ( target.is('.selected') ) {
                    if ( target.closest('.submenu').length) {
                        target.closest('.submenu').removeClass('submenu-opened');
                            closeSubmenu(target);
                    }
                    else {
                        target.closest('.top-menu-wrapper').removeClass('submenu-opened');
                        if ( ! window.matchMedia('(min-width: 992px)').matches || $('.constructor-page-wrapper').length ) {
                            closeSubmenu(target);
                        }
                    }
                }
                else {
                    if ( target.closest('.submenu').length ) {
                        target.closest('.submenu').addClass('submenu-opened');
                    }
                    else {
                        target.closest('.top-menu-wrapper').addClass('submenu-opened');
                    }
                    openSubmenu(target);
                }
            } );

            lists.find('.top-menu-lists-close-wrapper').click(closeMenu);

            $('.main-wrapper').on( 'click', function() {
                if ( window.matchMedia('(min-width: 992px)').matches ) {
                    var openedSumbenu2 = lists.find('.submenu-2.opened');
                    if ( openedSumbenu2.length ) {
                        openedSumbenu2.prev('.has-submenu').trigger('click');
                    }
                }
                
            } );
        };

        function openMenu() {
            /*topMenuBag.closeBag();*/
            
            if ( $('.left-menu-wrapper').length) {
                leftMenu.closeAll();
            }

            openBtn.addClass('selected');

            lists.addClass('visible');

            freezeBody();

            overlay.addClass('visible menu-opened');
        }

        function closeMenu() {
            lists.removeClass('visible');
            openBtn.removeClass('selected');

            unfreezeBody();

            overlay.removeClass('visible menu-opened');
        }

        function btnClickHndlr() {
            if ( lists.is('.visible') ) {
                closeMenu();
            }
            else {
                openMenu();
            }
        }

        function openSubmenu(target) {
            var submenu = target.next('.submenu'),
            secondParent = target.parent().parent();

            secondParent.find('.selected').removeClass('selected');
            secondParent.find('.submenu-opened').removeClass('submenu-opened');

            /*PERFECT RESPONSIVE MENU :)*/
            if ( window.matchMedia('(max-width: 992px)').matches ) {
                secondParent.find('.opened').slideUp( {complete: function () {
                    $(this).css('display', '').removeClass('opened');
                }} );

                submenu.slideDown( {complete: function () {
                    $(this).css('display', '');
                }} );
            }
            else {
                secondParent.find('.opened').removeClass('opened');
            }

            submenu.addClass('opened');
            target.addClass('selected');
        }

        function closeSubmenu(target) {
            var submenu = target.next('.submenu');
            target.removeClass('selected');

            if ( window.matchMedia('(min-width: 992px)').matches ) {
                submenu.removeClass('opened');
            }
            else {
                submenu.slideUp( {
                    complete: function () {
                        $(this).css('display', '');
                        submenu.removeClass('opened');
                    }
                } );
            }
        }

        return {
            init: init,
            closeMenu: closeMenu
        };
    }
    if ( $('.top-menu-lists-wrapper').length ) {
        var topMenuLists = TopMenuLists();
        topMenuLists.init();
    }

    function TopMenu () {
        var container = $('.top-menu-wrapper'),
        specials = $('.specials-wrapper'),
        height;
        
        var init = function () {
            initHeight();

            if ( window.matchMedia('(min-width: 992px)').matches ) {
                specials.css('margin-top', height + 'px');
            }

            $(window).resize(function () {
                initHeight();
                specials.css('margin-top', height + 'px');
            });

            $(window).scroll(scrollHndlr);

            if ( window.matchMedia('(min-width: 992px)').matches && ! container.is('.top-menu-wrapper-constructor-page') ) {
                $('.initial-click').trigger('click');
            }
        };

        function initHeight() {
            height = $('.top-menu-wrapper').outerHeight();
            if ( window.matchMedia('(min-width: 992px)').matches && ! container.is('.top-menu-wrapper-constructor-page') ) {
                height += $('.initial-click').next('.submenu').height();
            }
            height = Math.floor(height);
        }
        
        function scrollHndlr() {
            if ( $(this).scrollTop() > height) {
                container.addClass('shifted');
            }
            else if ( container.is('.shifted') ) {
                container.removeClass('shifted');
            }
        }

        return {
            init: init
        };
    }
    if ( $('.top-menu-wrapper').length ) {
        var topMenu = TopMenu();
        topMenu.init();
    }

   /* function TopMenuSearch() {
        var container = $('.top-menu-search-wrapper'),
            openBtn = $('.top-menu-action .top-menu-search'),
            topMenu = $('.top-menu-wrapper');
        
        var init = function () {
            openBtn.click(clickHndlr);
        };

        function clickHndlr() {
            if ( container.is('.visible') ) {
                closeSearch();
            }
            else {
                openSearch();
            }
        }
        
        function openSearch() {
            container.addClass('visible');
            topMenu.addClass('search-opened');
            openBtn.addClass('selected');
        }

        function closeSearch() {
            container.removeClass('visible');
            topMenu.removeClass('search-opened');
            openBtn.removeClass('selected');
        }
        
        return {
            init: init
        };
    }
    if ( $('.top-menu-search-wrapper').length ) {
        var topMenuSearch = TopMenuSearch();
        topMenuSearch.init();
    }*/

    function LeftMenu() {
        var filterWrapper = $('.left-menu-filter-wrapper'),
        profileWrapper = $('.left-menu-profile-wrapper'),
        messagesWrapper = $('.left-menu-messages-wrapper'),
        actionsList = $('.left-menu-user-actions-list'),
        wrapper = $('.left-menu-wrapper'),
        nav = $('.left-menu-nav'),
        overlay = $('.overlay'),
        goTopBtn = $('.left-menu-go-top'),
        categories = [],
        time = 500,
        currentIndex = 0,
        timeout,
        scrollTime = 750,
        scrollEasing = 'easeInOutCubic',
        headerHeight;

        var init = function () {
            initSections();
            initNav();

            headerHeight = $('.top-menu-wrapper').outerHeight();

            actionsList.find('.left-menu-user-filter').click(filterClickHandler);
            filterWrapper.find('.left-menu-filter-close-wrapper').click(closeFilter);

            actionsList.find('.left-menu-user-profile').click(profileClickHandler);
            profileWrapper.find('.left-menu-profile-close-wrapper').click(closeProfile);

            actionsList.find('.left-menu-user-messages').click(messagesClickHandler);
            messagesWrapper.find('.left-menu-messages-close-wrapper').click(closeMessages);

            $('.wrapper').on('touchstart', function () {
                wrapper.swipe({
                    swipeRight: function () {
                        openFilter();
                    }
                });

                filterWrapper.swipe({
                    swipeLeft: function () {
                        closeFilter();
                    }
                });

                profileWrapper.swipe({
                    swipeLeft: function () {
                        closeProfile();
                    }
                });

                messagesWrapper.swipe({
                    swipeLeft: function () {
                        closeMessages();
                    }
                });
            });

            setClickOutside(filterWrapper,closeFilter);
            setClickOutside(profileWrapper, closeProfile);
            setClickOutside(messagesWrapper, closeMessages);

            $(window).scroll(function () {
                var windowTop = $(this).scrollTop();
                var isBreak = false;

                $('.category').each(function () {
                    if ( !isBreak ) {
                        if ( $(this).offset().top > windowTop) {
                            currentIndex = categories.indexOf( $(this).attr('id') );
                            setSelectedItem( nav.find('.left-menu-nav-item').eq(currentIndex) );
                            isBreak = true;
                        }
                    }
                });
            });

            $( '.left-menu-wrapper a[href*=\\#]' ).on('click', function(e) {
                e.preventDefault();

                $('html,body').animate({
                    scrollTop: $(this.hash).offset().top - headerHeight
                }, {
                    duration: scrollTime,
                    easing: scrollEasing,
                    queue: false
                });
            });

            goTopBtn.click(goTop);
        };

        function filterClickHandler() {
            if ( filterWrapper.is('.visible') ) {
                closeFilter();
            }
            else {
                openFilter();
            }
        }

        function profileClickHandler() {
            if ( profileWrapper.is('.visible') ) {
                closeProfile();
            }
            else {
                openProfile();
            }
        }

        function messagesClickHandler() {
            if ( messagesWrapper.is('.visible') ) {
                closeMessages();
            }
            else {
                openMessages();
            }
        }

        function openFilter() {
            /*topMenuBag.closeBag();*/

            filterWrapper.addClass('visible');

            freezeBody();

            overlay.addClass('visible');
            actionsList.find('.left-menu-user-filter').addClass('selected');
            if (timeout) { clearTimeout(timeout); }
        }

        function closeFilter() {
            filterWrapper.removeClass('visible');

            unfreezeBody();

            overlay.removeClass('visible');
            timeout = setTimeout(function () {
                actionsList.find('.left-menu-user-filter').removeClass('selected');
            }, time);
        }

        function openProfile() {
            /*topMenuBag.closeBag();*/

            profileWrapper.addClass('visible');

            freezeBody();

            overlay.addClass('visible');
            actionsList.find('.left-menu-user-profile').addClass('selected');
            if (timeout) { clearTimeout(timeout); }
        }

        function closeProfile() {
            profileWrapper.removeClass('visible');

            unfreezeBody();

            overlay.removeClass('visible');
            timeout = setTimeout(function () {
                actionsList.find('.left-menu-user-profile').removeClass('selected');
            }, time);
        }

        function openMessages() {
            /*topMenuBag.closeBag();*/

            messagesWrapper.addClass('visible');

            freezeBody();

            overlay.addClass('visible');
            actionsList.find('.left-menu-user-messages').addClass('selected');
            if (timeout) { clearTimeout(timeout); }
        }

        function closeMessages() {
            messagesWrapper.removeClass('visible');

            unfreezeBody();

            overlay.removeClass('visible');
            timeout = setTimeout(function () {
                actionsList.find('.left-menu-user-messages').removeClass('selected');
            }, time);
        }

        function initSections() {
            var $sections = $('.main-content').find('.category');

            $sections.each(function () {
                categories.push( $(this).attr('id') );
            });
        }

        function initNav() {
            for (var i = 0; i < categories.length; i++) {
                nav.append('<li class="left-menu-nav-item"><a href="#'+ categories[i]+ '"><span></span></a></li>');
                if (i == 0) {
                    nav.find('.left-menu-nav-item').addClass('selected');
                }
            }
        }

        function setSelectedItem(item) {
            nav.find('.left-menu-nav-item.selected').not(item).removeClass('selected');
            item.addClass('selected');
        }

        var closeAll = function () {
            if ( filterWrapper.is('.visible') ) { closeFilter(); }
            if ( profileWrapper.is('.visible') ) { closeProfile(); }
            if ( messagesWrapper.is('.visible') ) { closeMessages(); }
        };

        function goTop() {
            $('html, body').animate({
                scrollTop: 0 }, {
                    duration: scrollTime,
                    easing: scrollEasing,
                    queue: false
                });
        }

        return {
            init: init,
            closeAll: closeAll
        };
    }
    if ( $('.left-menu').length ) {
        var leftMenu = LeftMenu();
        leftMenu.init();
    }

    function SpecialsSlider() {
        var container = $('.specials-slider'),
        options = {
            autoplay: true,
            infinite: false,
            swipe: false,
            autoplaySpeed: 5000,
            dots: true,
            nextArrow: '<div class="specials-next"><span></span></div>',
            prevArrow: '<div class="specials-prev"><span></span></div>'
        };


        var init = function () {
            container.slick(options);

            container.on( 'click', function(e) {
                if ( window.matchMedia('(min-width: 992px)').matches ) {
                    if ( container.is('.dots-visible') ) {
                        var target = $(e.target);
                        if ( target.closest('.slick-dots').length == 0 && ! target.is('.specials-button') && target.closest('.slick-arrow').length == 0 ) {
                            hideBody();
                        }
                    }
                }
            } );

            container.on( 'click', '.special-head', function (e) {
                if ( window.matchMedia('(min-width: 992px)').matches ) {
                    e.preventDefault();

                    if ( $(this).is('.selected') ) {
                        hideBody();
                    }
                    else {
                        showBody();
                    }
                }
            } );
        };

        function showBody() {
            container.addClass('special-body-opened');
            container.find('.special-body').slideDown( function() {
                container.addClass('dots-visible');
                $(this).addClass('visible').attr('style', '');
            } );
            container.find('.special-head').addClass('selected');
        }

        function hideBody() {
            container.removeClass('dots-visible');
            container.find('.special-body').slideUp( function() {
                container.find('.special-head').removeClass('selected');
                container.removeClass('special-body-opened');
                $(this).removeClass('visible').attr('style', '');
            } );
            
        }

        return {
            init: init
        };
    }
    if ( $('.specials-slider').length ) {
        var specialsSlider = SpecialsSlider();
        specialsSlider.init();
    }

    function HeaderText() {
        var headerTextHidden = $('.header-text-hidden'),
        headerToggle = $('.header-toggle'),
        isOpened = false,
        slideEasing = 'swing',
        slideTime = 750;

        var init = function () {
            $('.wrapper').on('touchstart', function () {
                headerToggle.swipe({
                    swipeUp: function () {
                        if (isOpened == true) {
                            closeText();
                        }
                    },
                    swipeDown:function () {
                        if (isOpened == false) {
                            openText();
                        }
                    }
                });
            });
            headerToggle.click(function () {
                if (isOpened == false) {
                    openText();
                }
                else if (isOpened == true) {
                    closeText();
                }
            });
        };

        function openText() {
            headerTextHidden.slideDown(slideTime, slideEasing);
            isOpened = true;
            headerToggle.addClass('opened');
        }

        function closeText() {
            headerTextHidden.slideUp(slideTime, slideEasing);
            isOpened = false;
            headerToggle.removeClass('opened');
        }

        return {
            init: init
        };
    }
    if ( $('.header-text').length ) {
        var headerText = HeaderText();
        headerText.init();
    }

    function ItemsSlider(container, paginationPath) {
        var carousel,
        options = {
            freeScroll: true,
            initialIndex: 0,
            cellAlign: 'left',
            contain: true,
            prevNextButtons: true,
            pageDots: false,
            dragThreshold: 15,
            groupCells: true,
            selectedAttraction: 0.015,
            freeScrollFriction: 0.1
        };

        var init = function () {
            carousel = container.flickity(options);
            var flkty = carousel.data('flickity');

            carousel.on( 'select.flickity', function() {
                if ( flkty.selectedIndex >= (flkty.cells.length / 2 ) ) {
                    $.post(paginationPath, {}, function (data) {
                        if ( data.length ) {
                            var slide = $( data );
                            flkty.append(slide);
                        }
                    });
                }
            });
        };

        return {
            init: init
        };
    }

    var categoriesSliders = [];
    $('.categories-slider').each( function () {
        var slider = ItemsSlider( $(this), 'php/slider.php' );

        slider.init();

        categoriesSliders.push( slider );
    } );

    var $itemSuggestionsSlider = $('.item-suggestions-slider');
    if ( $itemSuggestionsSlider.length ) {
        var itemSuggestionsSlider = ItemsSlider( $itemSuggestionsSlider, 'php/slider.php' );
        itemSuggestionsSlider.init();
    }

    function LeftMenuFilterPriceSlider() {
        var container = $('.left-menu-filter-price-slider'),
        min = $('#filter_range_min'),
        max = $('#filter_range_max'),
        maximumVal,
        minimumVal;

        function updateInputs (event, ui) {
            min.val( ui.values[0] );
            max.val( ui.values[1] );
        }

        var init = function () {
            maximumVal = parseFloat( container.attr('data-max'));
            minimumVal = parseFloat( container.attr('data-min') );
            var values={
                'min': (min.val().length)?min.val():minimumVal,
                'max': (max.val().length)?max.val():maximumVal
            };
            container.slider( {
                min: minimumVal,
                max: maximumVal,
                values: [values.min, values.max],
                range: true,
                stop: function (event, ui) {
                    updateInputs(event, ui);
                },
                slide: updateInputs,
                create: function () {
                    min.val( container.slider('values', 0) );
                    max.val( container.slider('values', 1) );
                }
            });

            min.on('input', minChangeHandler);
            max.on('input', maxChangeHandler);

            /*ONLY NUMBERS*/
            $('#left-menu-price-from, #left-menu-price-to').keydown(function (e) {
                if ( $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    (e.keyCode >= 35 && e.keyCode <= 40) ) {
                    return;
            }
            if ( (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) ) {
                e.preventDefault();
            }
        });
        };

        function minChangeHandler() {
            var minVal = parseInt( min.val() ),
            maxVal = parseInt( max.val() );

            if (minVal < minimumVal) {
                minVal = minimumVal;
                min.val(minVal);
            }

            if( parseInt(minVal) > parseInt(maxVal) ){
                minVal = maxVal;
                min.val(minVal);
            }

            container.slider('values', 0, minVal);
        }

        function maxChangeHandler() {
            var minVal = parseInt( min.val() ),
            maxVal = parseInt( max.val() );

            if (maxVal > maximumVal) {
                maxVal = maximumVal;
                max.val(maxVal);
            }

            if( minVal > maxVal ){
                maxVal = minVal;
                max.val(maxVal);
            }
            
            container.slider('values', 1, maxVal);
        }

        return {
            init: init
        };
    }
    if ( $('.left-menu-filter-price-slider').length ) {
        var leftMenuFilterPriceSlider = LeftMenuFilterPriceSlider();
        leftMenuFilterPriceSlider.init();
    }

    function LeftMenuFilterList() {
        var container = $('.left-menu-filter-list-wrapper'),
        offersList = $('.left-menu-filter-offers-list'),
        slideSpeed = 250,
        slideEasing = 'linear',
        elementsToShow = 8;

        var init = function () {
            container.on('click', '.has-submenu', submenuHandler);

            container.on('click', '.show-hide', showHideElements);

            container.on('click', 'input', function(e) {
                setSelectedLabel(e);
            });

            /*PREVENT CLOSING FILTER*/
            container.on('touchmove', function (e) {
                e.stopPropagation();
            });

            offersList.on('click', 'input', function(e) {
                setSelectedLabel(e);
            });

            container.find('.submenu-1').each(function () {
                hideElements( $(this) );
            });
        };

        function hideElements(container) {
            var hiddenElements = container.find('.left-menu-filter-item');
            hiddenElements = hiddenElements.slice(elementsToShow, hiddenElements.length);

            hiddenElements.each(function () {
                $(this).hide();
            });
        }

        function submenuHandler(e) {
            var target = $(e.target),
            submenu = target.next('.submenu-1');

            if ( target.parent().is('.selected') ) {
                target.parent().removeClass('selected');
                submenu.slideUp(slideSpeed, slideEasing).removeClass('opened');
                showSelectedItems( target.parent() );
            }
            else {
                target.parent().addClass('selected');
                submenu.slideDown(slideSpeed, slideEasing).addClass('opened');
            }
        }

        function showHideElements(e) {
            var target = $( e.target.closest('.show-hide') );
            if ( target.is('.selected') ) {
                target.removeClass('selected').find('span').text('Показать все');
                hideElements( target.closest('.submenu-1') );
            }
            else {
                target.addClass('selected').find('span').text('Скрыть');
                target.siblings('.left-menu-filter-item:hidden').show();
            }
        }

        function setSelectedLabel(e) {
            var label = $(e.target).parent();
            label.toggleClass('selected');
        }

        function showSelectedItems(container) {
            var selectedItemsText = container.find('.filter-selected-items'),
            $selectedItems = container.find('label.selected'),
            selectedItems = [];

            $selectedItems.each(function () {
                selectedItems.push( $(this).text() );
            });

            selectedItemsText.text( selectedItems.join(', ') );
        }

        return {
            init: init
        };
    }
    if ( $('.left-menu-filter-list').length ) {
        var leftMenuFilterList = LeftMenuFilterList();
        leftMenuFilterList.init();
    }

    if ( $('.swipebox').length ) {
        $('body').swipebox( { 
            selector: '.swipebox',
            removeBarsOnMobile: false 
        } );
    }

    function NewsItemSuggestionsSlider() {
        var container = $('.news-item-suggestions-slider'),
        options = {
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 3,
            arrows: false,
            responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1
                }
            }]
        };

        var init = function () {
            container.slick(options);
        };

        return {
            init: init
        };
    }
    if ( $('.news-item-suggestions-slider').length ) {
        var newsItemSuggestionsSlider = NewsItemSuggestionsSlider();
        newsItemSuggestionsSlider.init();
    }

    function StartPageNewsSlider() {
        var container = $('.start-page-news-slider'),
        options = {
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 4,
            arrows: false,
            dots: true,
            infinite:false,
            responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1
                }
            }]
        };

        var init = function () {
            container.slick(options);
        };

        return {
            init: init
        };
    }
    if ( $('.start-page-news-slider').length ) {
        var startPageNewsSlider = StartPageNewsSlider();
        startPageNewsSlider.init();
    }

    function RecallsPopUp() {
        var firstClickOverlay = $('.text-area-first-click-overlay'),
        textarea = $('.recalls-textarea'),
        popUp = $('.recalls-pop-up'),
        wrapper = $('.wrapper'),
        closeBtn = $('.recalls-pop-up-close'),
        solveProblemContainer = $('.recalls-pop-up-solve-problem'),
        recallsPopUpStartContent = $('.recalls-pop-up-start-content'),
        overlay = $('.pop-up-overlay');

        var init = function () {
            firstClickOverlay.click(showPopUp);

            closeBtn.click(closePopUp);

            popUp.find('.recalls-pop-up-button-leave-recall').click(closePopUp);

            popUp.find('.recalls-pop-up-button-solve-problem').click(showSolveProblemContainer);
        };

        function closePopUp() {
            wrapper.removeClass('blurred');
            overlay.removeClass('visible');
            popUp.remove();
            textarea.focus();

            unfreezeBody();
        }

        function showPopUp() {
            popUp.addClass('visible');
            wrapper.addClass('blurred');
            overlay.addClass('visible');
            firstClickOverlay.remove();
            freezeBody();
        }

        function showSolveProblemContainer () {
            recallsPopUpStartContent.hide();
            solveProblemContainer.show();
        }

        return {
            init: init
        };
    }
    if ( $('.recalls-form .recalls-textarea').length ) {
        var recallsPopUp = RecallsPopUp();
        recallsPopUp.init();
    }

    function CallBackPopUp() {
        var popUp = $('.call-back-pop-up'),
        openBtn = $('.top-menu-action .top-menu-phone'),
        overlay = $('.pop-up-overlay'),
        wrapper = $('.wrapper');

        var init = function () {
            openBtn.click(openPopUp);
            popUp.find('.call-back-pop-up-close').click(closePopUp);
            overlay.click(closePopUp);
        };
        
        function openPopUp() {
            popUp.addClass('visible');
            overlay.addClass('visible');
            wrapper.addClass('blurred');
            freezeBody();
        }

        function closePopUp() {
            popUp.removeClass('visible');
            overlay.removeClass('visible');
            wrapper.removeClass('blurred');
            unfreezeBody();
        }

        return {
            init: init
        };
    }
    if ( $('.call-back-pop-up').length ) {
        var callBackPopUp = CallBackPopUp();
        callBackPopUp.init();
    }

    function SuccessBuyPopUp() {
        var popUp = $('.success-buy-pop-up'),
            openBtn = $('.item-buy-button'),
            overlay = $('.pop-up-overlay'),
            wrapper = $('.wrapper');

         var init = function() {
            openBtn.on('click', openPopUp);
            popUp.find('.success-buy-pop-up-button-close').click(closePopUp);
            overlay.click(closePopUp);
         };

         function openPopUp() {
            /*BACKEND*/
            /*var $url = openBtn.attr('data-url');
            $.get( $url, function(data) {
                $('.top-menu-bag-count').trigger('numberchanged').html(data);
            } );*/
            /*BACKEND*/
            popUp.addClass('visible');
            overlay.addClass('visible');
            wrapper.addClass('blurred');
            freezeBody();
         }

         function closePopUp() {
            popUp.removeClass('visible');
            overlay.removeClass('visible');
            wrapper.removeClass('blurred');
            unfreezeBody();
        }

         return {
            init: init
         };  
    }
    if ( $('.success-buy-pop-up').length ) {
        var successBuyPopUp = SuccessBuyPopUp();
        successBuyPopUp.init();
    }

    function SuccessUserActionPopUp() {
        var popUp = $('.success-user-action-pop-up'),
            overlay = $('.pop-up-overlay'),
            wrapper = $('.wrapper');

        var init = function() {
            overlay.addClass('visible');
            wrapper.addClass('blurred');
            freezeBody();
            
            popUp.find('.success-user-action-pop-up-close').click(closePopUp);
            overlay.click(closePopUp);
         };

         function closePopUp() {
            popUp.remove();
            overlay.removeClass('visible');
            wrapper.removeClass('blurred');
            unfreezeBody();
        } 

        return {
            init: init
        };   
    }
    if ( $('.success-user-action-pop-up').length ) {
        var successUserActionPopUp = SuccessUserActionPopUp();
        successUserActionPopUp.init();
    }
    function PersonalAreaOffersTable() {
        var table = $('.personal-area-user-offers');
        
        var init = function () {
            table.on('click', '.personal-area-user-offers-cell:nth-child(1)', clickHndlr);
        };

        function clickHndlr(e) {
            var target = $(e.target);
            if ( target.is('.opened') ) {
                target.removeClass('opened').siblings('.personal-area-user-offers-row > div:not(:nth-child(1)):not(:nth-child(2))')
                .removeClass('visible');
            }
            else {
                target.addClass('opened').siblings('.personal-area-user-offers-cell').addClass('visible');
            }
        }
        
        return {
            init: init
        };
    }
    if ( $('.personal-area-user-offers').length ) {
        var personalAreaOffersTable = PersonalAreaOffersTable();
        personalAreaOffersTable.init();
    }

    function PersonalAreaFooterSelect() {
        var select = $('.personal-area-footer-select'),
        selectDesktops = $('.personal-area-footer-select-desktops'),
        offers = $('.personal-area-user-offers'),
        contacts = $('.personal-area-user-contacts');

        var init = function () {
            select.on('change', chngHndlr);
            selectDesktops.on('click', '.personal-area-footer-select-desktops-option', clickHndlr);

            if ( window.matchMedia('(min-width: 992px)').matches ) {
                selectDesktops.find('[data-select="my-offers"]').trigger('click');
            }
            else {
                select.trigger('change');
            }
        };

        function clickHndlr(e) {
            var target = $(e.target);

            var val = target.data('select');

            selectDesktops.find('.personal-area-footer-select-desktops-option.selected').removeClass('selected');
            target.addClass('selected');

            if (val == 'my-offers') {
                if ( offers.css('display') == 'none' ) {
                    offers.addClass('opened');
                    contacts.removeClass('opened');
                    select.val('my-offers');
                }
            }
            else if (val == 'my-contacts') {
                contacts.addClass('opened');
                offers.removeClass('opened');
                select.val('my-contacts');
            }
        }

        function chngHndlr() {
            var val = select.val();

            if (val == 'my-offers') {
                offers.addClass('opened');
                contacts.removeClass('opened');
                selectDesktops.find('.personal-area-footer-select-desktops-option.selected').removeClass('selected');
                selectDesktops.find('[data-select="my-offers"]').addClass('selected');
            }
            else if (val == 'my-contacts') {
                contacts.addClass('opened');
                offers.removeClass('opened');
                selectDesktops.find('.personal-area-footer-select-desktops-option.selected').removeClass('selected');
                selectDesktops.find('[data-select="my-contacts"]').addClass('selected');
            }
            select.blur();
        }

        return {
            init: init
        };
    }
    if ( $('.personal-area-footer-select').length ) {
        var personalAreaFooterSelect = PersonalAreaFooterSelect();
        personalAreaFooterSelect.init();
    }
    
    function BagDropdown(container) {
        var $options = container.find('.options'),
        $selectedOption = container.find('.selected-option');

        var init = function () {

            if( !container.find('input[type=radio]:checked').length ){
                container.find('input[type=radio]:first').prop('checked', true);
                setSelectedOption(0);
            }
            else {
                setSelectedOption( $options.find('label').index( container.find('input[type=radio]:checked').parent() ) );
            }

            $selectedOption.click(function () {
                if ( $options.is('.opened') ) {
                    closeOptions();
                }
                else {
                    openOptions();
                }
            });

            if ( container.is('.bag-payment-dropdown') ) {
                var $descriptionsList = container.find('.bag-payment-dropdown-descriptions');

                $descriptionsList.find('li').eq(0).addClass('visible');

                $options.on('click', 'input', function (e) {
                    var index = $(e.target).parent().data('descr');

                    $descriptionsList.find('.visible').removeClass('visible');
                    
                    $descriptionsList.find('li[data-descr=' + index + ']').addClass('visible');
                });
            }

            $options.on('click', 'input', optionsClickHndlr );
        };

        function optionsClickHndlr(e) {
            var label = $(e.target).parent(),
            index = $options.find('label').index(label);

            setSelectedOption(index);
            closeOptions();
        }
        
        function openOptions() {
            $options.addClass('opened');
            $selectedOption.addClass('selected');
        }
        
        function closeOptions() {
            $options.removeClass('opened');
            $selectedOption.removeClass('selected');
        }

        function setSelectedOption(index) {
            $selectedOption.text( $options.find('label').eq(index).text() );
        }

        return {
            init: init
        };
    }
    var bagDropdowns = [];

    $('.bag-dropdown').each(function () {
        bagDropdowns.push( BagDropdown( $(this) ) );
    });
    for (var i = 0; i < bagDropdowns.length; i++) {
        bagDropdowns[i].init();
    }

    $('#new-post-wrapper').on( 'newpostload', function() {
        var startIndex = 2;

        $(this).find('.bag-dropdown').each( function() {
            bagDropdowns[startIndex] = BagDropdowns( $(this) );
            bagDropdowns[startIndex].init();
            startIndex++; 
        } );
    } );

    function ItemVideo() {
        var overlay = $('.item-video-overlay'),
        video = $('.item-video-player');
        
        var init = function () {
            overlay.on('touchstart', function () {
                if ( video.get(0).paused ) {
                    video.get(0).play();
                    overlay.addClass('hidden');
                }
                else {
                    video.get(0).pause();
                    overlay.removeClass('hidden');
                }
            });

            overlay.on('mouseenter', function () {
                video.get(0).play();
                overlay.addClass('hidden');
            });

            overlay.on('mouseleave', function () {
                video.get(0).pause();
                overlay.removeClass('hidden');
            });
        };

        return {
            init: init
        };
    }
    if ( $('.item-video video').length ) {
        var itemVideo = ItemVideo();
        itemVideo.init();
    }    

    /*function InfiniteScroller(container) {
        var index = 3,
            flag = true,
            link = container.data('path'),
            last = parseInt( container.data('last') ) + 1;

        var init = function() {
            container.infiniteScroll( {
                path: function() {
                    if( index <= last && flag ) {
                        return link;
                    }
                },
                append: '.list-content-item',
                history: false,
                status: '.infinite-scroll-load-status'
            } );

            container.on( 'request.infiniteScroll', function( ) {
                flag = false;
            } );
            container.on( 'load.infiniteScroll', function( ) {
                var str = '/' + index++;
                link = link.replace(/\/\d+/, str);
                flag = true;
            } );
            container.on( 'last.infiniteScroll', function() {
                $('.infinite-scroll-load-status').remove();
            } );
        };

        return {
            init: init
        };
    }
    if ( $('.list-content').length ) {
        var listContentScroller = InfiniteScroller( $('.list-content') );
        listContentScroller.init();
    }*/

});