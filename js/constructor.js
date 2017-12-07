$(window).on( 'load', ( function () {
    function Constructor() {
        var container,
            tabs = $('.canvas-constructor-controls'),
            options = $('.canvas-constructor-options'),
            topControls = $('.canvas-constructor-top-controls'),
            background = $('#canvas-constructor-background'),
            images = [],
            texts = [],
            canvasOptions = {},
            textColorTimeout,
            overlay,
            canvas;

        var init = function () {
            initCanvas(canvasOptions);

            addOverlayItems();

            if ( background.length ) {
                setBackground( background.data('path') );
            }

            canvas.on( {
                'selection:cleared': function () {
                    hideRedoUndo();
                    var index = $('.canvas-constructor-images-list').find('.canvas-constructor-images-list-item.selected')
                        .removeClass('selected').find('img').data('image-index');
                    hideImgEditor(index);
                },
                'object:moving': setTransparentObjects,
                'object:modified': function(e) {
                    canvas.forEachObject( function (o) {
                        o.opacity = 1;
                    } );
                    if ( canvas.getActiveObjects().length == 1 ) {
                        var target = e.target;
                        saveState(target);
                        updateRedoUndo();
                    }
                }
            } );

            $('.canvas-container').on( 'touchstart', function() {
                if ( options.find('.opened').length ) {
                    tabs.find('.canvas-constructor-control.selected').trigger('click');
                }
            } );

            tabs.on( 'click', '.canvas-constructor-control', function () {
                var id = $(this).data('control');
                if ( $(this).is('.selected') ) {
                    hideOption( id, $(this) );
                }
                else {
                    showOption( id, $(this) );
                }
            } );

            topControls.find('.canvas-constructor-preview').on( 'click', function () {
                if ( $(this).is('.selected') ) {
                    hidePreview();
                }
                else {
                    sendPreview();
                }
                $(this).toggleClass('selected');
            } );

            topControls.find('.canvas-constructor-reset').on('click', resetCanvas);

            topControls.on('click', '.canvas-constructor-undo', undo)
                .on('click', '.canvas-constructor-redo', redo)
                .on('click', '.canvas-constructor-undo, .canvas-constructor-redo', updateRedoUndo);

            options.find('.canvas-constructor-images-form input').on( 'change', function() {
                $(this).closest('.canvas-constructor-images-form').submit();
            } );

            options.find('.canvas-constructor-phones-form').on('submit', sendBackground);

            options.find('.canvas-constructor-phones-form select:nth-child(2)').on('change', function () {
                $(this).closest('.canvas-constructor-phones-form').submit();
            });

            options.find('.canvas-constructor-images-form').on('submit', sendImg);

            options.find('.canvas-constructor-images').on('click', '.canvas-constructor-delete-image', deleteImg)
                .on('click', '.canvas-constructor-reset-image', resetImg)
                .on( 'click', '.canvas-constructor-images-list-item img', function (e) {
                    showImgEditor(e);
                    setActiveImg(e);
                    setActiveImgThumbnail( $(this).parent() );
                } );

            options.find('.canvas-constructor-texts').on( 'click', '.canvas-constructor-delete-text', deleteText)
                .on('click', '.canvas-constructor-texts-list-item', function (e) {
                setActiveText(e);
                showTextEditor(e);
                setActiveTextThumbnail( $(this) );
            } );

            options.on( 'click', '.canvas-constructor-add-text', function () {
                addText('Работает \nмногострочность');
                addTextItem();
                addTextEditor();
                $('.canvas-constructor-texts-list').find('.canvas-constructor-texts-list-item:last-child').trigger('click');
                checkLineHeightControls();
            } );

            options.find('.canvas-constructor-images-editors-list').on('click', '.images-editor-controls-list-item-enlarge', enlargeImg)
                .on('click', '.images-editor-controls-list-item-minimize', minimizeImg)
                .on( 'click', '.images-editor-controls-list-item-rotate-right', function () {
                    rotateImg(5);} )
                .on( 'click', '.images-editor-controls-list-item-rotate-left', function () {
                    rotateImg(-5);
                } );

            options.find('.canvas-constructor-images-editors-list').on( 'click', '.images-editor-filter-list-item', function () {
                if ( ! $(this).is('.selected') ) {
                    $('.constructor-options-loader-overlay').addClass('visible');
                }
            } ).on( 'click', '.images-editor-filter-list-item-sepia', function () {
                if ( $(this).is('.selected') ) {
                    removeFilter(0);
                }
                else {
                    setTimeout(function () {
                        addFilter( 0, new fabric.Image.filters.Sepia() );
                    }, 10);
                }
            } ).on( 'click', '.images-editor-filter-list-item-greyscale', function () {
                if ( $(this).is('.selected') ) {
                    removeFilter(1);
                }
                else {
                    setTimeout( function () {
                        addFilter( 1, new fabric.Image.filters.Grayscale() );
                    }, 10);
                }
            } ).on( 'click', '.images-editor-filter-list-item-white-black', function () {
                if ( $(this).is('.selected') ) {
                    removeFilter(2);
                }
                else {
                    setTimeout(function () {
                        addFilter( 2, new fabric.Image.filters.BlackWhite() );
                    }, 10);
                }
            } ).on('click', '.images-editor-filter-list-item-vintage', function () {
                if ( $(this).is('.selected') ) {
                    removeFilter(3);
                }
                else {
                    setTimeout(function () {
                        addFilter( 3, new fabric.Image.filters.Vintage() );
                    }, 10);
                }
            }).on('click', '.images-editor-filter-list-item', function () {
                $(this).toggleClass('selected');
            });

            options.find('.canvas-constructor-texts-editors-list').on( 'click', '.text-editor-styles-list-item-bold', function () {
                if ( $(this).is('.selected') ) {
                    setTextStyle('fontWeight', 'normal');
                }
                else {
                    setTextStyle('fontWeight', 'bold');
                }
            } ).on( 'click', '.text-editor-styles-list-item-italic', function () {
                if ( $(this).is('.selected') ) {
                    setTextStyle('fontStyle', 'normal');
                }
                else {
                    setTextStyle('fontStyle', 'italic');
                }
            } ).on('click', '.text-editor-styles-list-item-underline', function () {
                if ( $(this).is('.selected') ) {
                    setTextStyle('underline', false);
                }
                else {
                    setTextStyle('underline', true);
                }
            } ).on( 'click', '.text-editor-styles-list-item', function () {
                    $(this).toggleClass('selected');
            } ).on( 'click', '.text-editor-alignment-list-item-center', function () {
                setTextStyle('textAlign', 'center');
            } ).on( 'click', '.text-editor-alignment-list-item-left', function () {
                setTextStyle('textAlign', 'left');
            } ).on( 'click', '.text-editor-alignment-list-item-right', function () {
                setTextStyle('textAlign', 'right');
            } ).on( 'click', '.text-editor-alignment-list-item-justify', function () {
                setTextStyle('textAlign', 'justify');
            } ).on( 'click', '.text-editor-alignment-list-item', function () {
                $(this).addClass('selected').siblings('.text-editor-alignment-list-item.selected').removeClass('selected');
            } ).on('change', '.canvas-constructor-font-family-select', function () {
                setTextStyle('fontFamily', $(this).val() );
            } ).on( 'click', '.text-editor-line-height-plus', function () {
                var lineHeight = canvas.getActiveObject().lineHeight + 0.25;
                if (lineHeight <= 3) {
                    setTextStyle('lineHeight', lineHeight);
                }
            } ).on( 'click', '.text-editor-line-height-minus', function () {
                var lineHeight = canvas.getActiveObject().lineHeight - 0.25;
                if (lineHeight >= 0.75) {
                    setTextStyle('lineHeight', lineHeight);
                }
            } );

            options.find('.canvas-constructor-texts-editors-list').on('input', 'textarea', updateText);

            tabs.find('.canvas-constructor-control-buy').on('click', sendCanvasData);

            $(window).on('resize', resizeCanvas);
        };


        function resizeCanvas() {
            initCanvasDimension();
        }

        function initCanvasDimension() {
            var wrapper = $('.canvas-constructor-wrapper'),
                topMenuWrapper = $('.top-menu-wrapper');

            if ( window.matchMedia('(min-width: 992px)').matches ) {
                canvas.setHeight( $(window).height() - topMenuWrapper.outerHeight() );
            }
            else {
                canvas.setHeight( $(window).height() - topMenuWrapper.outerHeight() - tabs.height() - 41 );
            }

            canvas.setWidth( wrapper.width() );
        }

        function resetCanvas() {
            $('.canvas-constructor-images-list-item').each(function () {
                $(this).find('.canvas-constructor-delete-image').trigger('click');
            });
            images = [];

            $('.canvas-constructor-texts-list-item').each(function () {
                $(this).find('.canvas-constructor-delete-text').trigger('click');
            });
            texts = [];
        }

        function showOption(id, tab) {
            options.find('.opened').removeClass('opened');
            options.find('#' + id).addClass('opened');

            tabs.find('.canvas-constructor-control.selected').removeClass('selected');
            tab.addClass('selected');
        }

        function hideOption(id, tab) {
            var option = options.find('#' + id);
            
            option.find('.visible').removeClass('visible');
            option.removeClass('opened');
            
            tab.removeClass('selected');

            if (id == 'images') {
                $('.canvas-constructor-images-list').find('.canvas-constructor-images-list-item.selected').removeClass('selected');
            }
            else if (id == 'text') {
                $('.canvas-constructor-texts-list').find('.canvas-constructor-texts-list-item.selected').removeClass('selected');
            }
        }

        function initCanvas(options) {
            canvas = new fabric.Canvas('canvas-constructor', options);
            container = $('.canvas-container');
            fabric.filterBackend = new fabric.WebglFilterBackend();
            initCanvasDimension();
        }

        function sendBackground(e) {
            var target = $(e.target),
                data = target.serialize();

            $.ajax( {
                url: 'php/background.php',
                type: 'POST',
                data: data,
                success: function (data) {
                    setBackground( JSON.parse(data).path );
                }
            } );

            e.preventDefault();
        }

        function setBackground(path) {
            fabric.Image.fromURL(path, function (background) {
                background.selectable = false;
                background.scaleToHeight(canvas.height);
                background.hoverCursor = 'default';

                background.id = 'background';

                canvas.add(background);
                canvas.centerObject(background);
            });
        }

        function sendImg(e) {
            var target = $(e.target);

            var formData = new FormData( target[0] );
            
            $.ajax({
                url: 'php/files.php',
                type: 'POST',
                data: formData,
                success: function (data) {
                    var imagesArray = JSON.parse( data );
                    addImg( imagesArray );
                    target[0].reset();
                },
                cache: false,
                contentType: false,
                processData: false
            });

            e.preventDefault();
        }

        function addImg(paths) {
            fabric.Image.fromURL(paths.bigImg, function (image) {
                image.states = [];
                image.currentStateIndex = 0;

                var index = images.length;

                image.on('selected', function() {
                    canvas.bringForward( canvas.getActiveObject() );

                    if ( canvas.getActiveObjects().length == 1 ) {
                        showRedoUndo();
                        updateRedoUndo();

                        if ( $('.canvas-constructor-images').is('.opened') ) {
                            options.find( '[data-image-index="' + index + '"]' ).trigger('click');
                        }
                    }
                });

                image.scaleToHeight( canvas.height / 1.75 );

                canvas.add(image);
                canvas.centerObject(image);
                image.setCoords();

                image.states.push( JSON.stringify( image.saveState() ) );
                images.push(image);

                addImgItem( paths.smallImg );
                addImgEditor();
            } );
        }

        function addImgItem(path) {
            var list = options.find('.canvas-constructor-images-list');

            var item = $('<li class="canvas-constructor-images-list-item"><img src="' + path + '" data-image-index="' + (images.length - 1) + '"><span class="canvas-constructor-delete-image"></span><span class="canvas-constructor-reset-image"></span></li>');
            list.append(item);
        }

        function addImgEditor() {
            var list = options.find('.canvas-constructor-images-editors-list');

            var item = $('<li class="canvas-constructor-images-editors-list-item clearfix" data-image-editor-index="' + (images.length - 1) + '">' +
                '<ul class="images-editor-controls-list">' +
                    '<li class="images-editor-controls-list-item images-editor-controls-list-item-enlarge"></li>' +
                    '<li class="images-editor-controls-list-item images-editor-controls-list-item-minimize"></li>' +
                    '<li class="images-editor-controls-list-item images-editor-controls-list-item-rotate-right"></li>' +
                    '<li class="images-editor-controls-list-item images-editor-controls-list-item-rotate-left"></li>' +
                '</ul>' +
                '<ul class="images-editor-filter-list">' +
                    '<li class="images-editor-filter-list-item images-editor-filter-list-item-sepia"></li>' +
                    '<li class="images-editor-filter-list-item images-editor-filter-list-item-greyscale"></li>' +
                    '<li class="images-editor-filter-list-item images-editor-filter-list-item-white-black"></li>' +
                    '<li class="images-editor-filter-list-item images-editor-filter-list-item-vintage"></li>' +
                '</ul>'+
                '</li>');

            list.append(item);
        }

        function showImgEditor(e) {
            var index = $(e.currentTarget).data('image-index'),
                list = options.find('.canvas-constructor-images-editors-list');

            list.find('.canvas-constructor-images-editors-list-item.visible').removeClass('visible');
            list.find('[data-image-editor-index="' + index + '"]').addClass('visible');
        }

        function hideImgEditor(index) {
            var list = options.find('.canvas-constructor-images-editors-list');

            list.find('[data-image-editor-index="' + index + '"]').removeClass('visible');
        }

        function enlargeImg() {
            var img = canvas.getActiveObject();
            img.scale(img.scaleX + 0.05);
            canvas.trigger('object:modified', { target: canvas.getActiveObject() });
            canvas.renderAll();
        }

        function minimizeImg() {
            var img = canvas.getActiveObject(),
                newScale = img.scaleX - 0.05;
            if (newScale > 0.1) {
                img.scale(newScale);
                canvas.renderAll();
            }
            else {}
            canvas.trigger('object:modified', { target: canvas.getActiveObject() })
        }

        function rotateImg(deg) {
            var img = canvas.getActiveObject();
            img.rotate(img.angle + deg);
            canvas.trigger('object:modified', { target: canvas.getActiveObject() });
            canvas.renderAll()
        }

        function setActiveImg(e) {
            var index = $(e.currentTarget).data('image-index');
            canvas.setActiveObject( images[index] );
            canvas.renderAll();
        }

        function setActiveImgThumbnail(thumbnail) {
            $('.canvas-constructor-images-list').find('.canvas-constructor-images-list-item.selected').removeClass('selected');
            thumbnail.addClass('selected');
        }

        function addFilter(index, filter) {
            var img = canvas.getActiveObject();
            img.filters[index] = filter;
            img.applyFilters();
            canvas.renderAll();
            $('.constructor-options-loader-overlay').removeClass('visible');
        }

        function removeFilter(index) {
            var img = canvas.getActiveObject();

            delete img.filters[index];
            img.applyFilters();

            canvas.renderAll();
        }

        function resetImg(e) {
            var target = $(e.target),
                index = target.siblings('img').data('image-index'),
                img = images[index];

            img.rotate(0);

            img.scaleToHeight( canvas.height / 1.75 );

            if ( img.filters.length ) {
                options.find('[data-image-editor-index="' + index + '"] .images-editor-filter-list-item.selected').removeClass('selected');
            }

            img.filters = [];
            img.states = [];
            img.currentStateIndex = 0;
            img.applyFilters();

            canvas.centerObject(img);
            img.setCoords();

            if  (img == canvas.getActiveObject() ) {
                updateRedoUndo();
            }

            canvas.trigger('object:modified', { target: img });
            canvas.renderAll();
        }

        function deleteImg(e) {
            var target = $(e.target),
                index = target.siblings('img').data('image-index');

            target.closest('.canvas-constructor-images-list-item').remove();

            $( '#' + images[index].elementId ).remove();

            canvas.remove( images[index] );

            options.find('[data-image-editor-index="' + index + '"]').remove();

            delete images[index];
        }

        function addText(val) {
            var text = new fabric.Text(val);

            text.states = [];
            text.currentStateIndex = 0;

            var index = texts.length;

            text.on('selected', function() {
                if (canvas.getActiveObjects().length == 1) {
                    canvas.bringForward( canvas.getActiveObject() );
                    showRedoUndo();
                    updateRedoUndo();

                    if ( $('.canvas-constructor-texts').is('.opened') ) {
                        options.find( '[data-text-index="' + index + '"]' ).trigger('click');
                    }
                }
            });

            canvas.add( text.set({
                fontSize: 32,
                fontFamily: 'sans-serif',
                lineHeight: 1
            }) );

            canvas.centerObject(text);
            text.setCoords();
            text.states.push( JSON.stringify( text.saveState() ) );
            texts.push(text);
        }

        function addTextItem() {
            var list = options.find('.canvas-constructor-texts-list');

            var item = $('<li class="canvas-constructor-texts-list-item" data-text-index="'+ (texts.length - 1) +'">Т<sub>' + texts.length + '</sub><span class="canvas-constructor-delete-text"></span></li>');
            list.append(item);
        }

        function showTextEditor(e) {
            var index = $(e.target).closest('.canvas-constructor-texts-list-item').data('text-index'),
                list = options.find('.canvas-constructor-texts-editors-list');

            list.find('.canvas-constructor-texts-editors-list-item.visible').removeClass('visible');
            list.find('[data-text-editor-index="' + index + '"]').addClass('visible');
        }

        function addTextEditor() {
            var list = $('.canvas-constructor-texts-editors-list');

            var item = '<li class="canvas-constructor-texts-editors-list-item clearfix" data-text-editor-index="' + (texts.length - 1) + '">' +
                    '<div class="canvas-constructor-texts-editors-list-item-top clearfix">' +
                        '<textarea class="canvas-constructor-textarea">Работает &#10;многострочность</textarea>' +
                        '<select class="canvas-constructor-font-family-select" onchange="$(this).blur()">' +
                            '<option value="sans-serif">Sans-serif</option>' +
                            '<option value="ClassicaOneRegular">Classica One Regular</option>' +
                            '<option value="RobotoRegular">Roboto Regular</option>' +
                            '<option value="Lobster">Lobster</option>' +
                        '</select>' +
                        '<div class="canvas-constructor-color-picker">' +
                        '</div>' +
                    '</div>' +
                    '<div class="canvas-constructor-texts-editors-list-item-bottom clearfix">' +
                        '<ul class="text-editor-styles-list" >' +
                        '<li class="text-editor-styles-list-item text-editor-styles-list-item-bold"></li>' +
                        '<li class="text-editor-styles-list-item text-editor-styles-list-item-italic"></li>' +
                        '<li class="text-editor-styles-list-item text-editor-styles-list-item-underline"></li>' +
                        '</ul>' +
                        '<div  class="text-editor-line-height">'+
                            '<span class="text-editor-line-height-plus"></span><span class="text-editor-line-height-minus"></span>' +
                        '</div>' +
                        '<ul class="text-editor-alignment-list">' +
                        '<li class="text-editor-alignment-list-item text-editor-alignment-list-item-center"></li>' +
                        '<li class="text-editor-alignment-list-item text-editor-alignment-list-item-left"></li>' +
                        '<li class="text-editor-alignment-list-item text-editor-alignment-list-item-right"></li>' +
                        '<li class="text-editor-alignment-list-item text-editor-alignment-list-item-justify"></li>' +
                        '</ul>' +
                    '</div>' +
                '</li>';

            list.append(item);

            var input = document.createElement('input'),
                picker = new jscolor(input),
                index = (texts.length - 1);

            picker.fromString('000000');

            picker.onFineChange = function () {
                setTextStyle('fill', '#' + this.toString() );
            };

            texts[texts.length - 1].picker = picker;

            input.setAttribute('readonly', 'true');

            list.find('[data-text-editor-index="' + index + '"]').find('.canvas-constructor-color-picker').append(input);
        }

        function setActiveText(e) {
            var index = $(e.target).closest('.canvas-constructor-texts-list-item').data('text-index');
            canvas.setActiveObject( texts[index] );
            canvas.renderAll();
        }

        function setActiveTextThumbnail(thumbnail) {
            $('.canvas-constructor-texts-list').find('.canvas-constructor-texts-list-item.selected').removeClass('selected');
            thumbnail.addClass('selected');
        }

        function updateText(e) {
            var target = $(e.target),
                newText = target.val(),
                index = target.closest('.canvas-constructor-texts-editors-list-item').data('text-editor-index');

            texts[index].set('text', newText);
            canvas.renderAll();
            checkLineHeightControls();
        }

        function setTextStyle(property, value) {
            var text = canvas.getActiveObject();

            text.set(property, value);

            if ( property == 'fill' ) {
                clearTimeout(textColorTimeout);
                textColorTimeout = setTimeout( function () {
                    canvas.trigger('object:modified', { target: canvas.getActiveObject() });
                }, 500 );
            }
            else {
                canvas.trigger('object:modified', { target: canvas.getActiveObject() });
            }

            canvas.renderAll();
        }

        function deleteText(e) {
            e.stopPropagation();
            var target = $(e.target),
                index = target.parent().data('text-index');

            target.closest('.canvas-constructor-texts-list-item').remove();

            canvas.remove( texts[index] );

            options.find('[data-text-editor-index="' + index + '"]').remove();

            canvas.renderAll();

            delete images[index];
        }
        
        function addOverlayItems() {
            container.append('<div class="canvas-container-overlay-left"></div><div class="canvas-container-overlay-right"></div>');
        }
        
        function initOverlayItems() {
            var width = ( container.width() - overlay.getScaledWidth() ) / 2;
            $('.canvas-container-overlay-left, .canvas-container-overlay-right').css('width', width + 1 + 'px');
        }
        
        function showOverlayItems() {
            $('.canvas-container-overlay-left, .canvas-container-overlay-right').addClass('visible');
        }

        function hideOverlayItems() {
            $('.canvas-container-overlay-left, .canvas-container-overlay-right').removeClass('visible');
        }

        function sendPreview() {
            var data = $('.canvas-constructor-phones-form').serialize();

            $.post( 'php/overlay.php', { phone: data }, function (data) {
                showPreview( JSON.parse( data ).path );
            } );
        }
        
        function showPreview(path) {
            fabric.Image.fromURL(path, function (image) {
                image.scaleToHeight(canvas.height);

                canvas.add(image);
                canvas.centerObject(image);

                canvas.discardActiveObject();

                canvas.forEachObject(function(o) {
                    o.selectable = false;
                });

                overlay = image;

                initOverlayItems();
                showOverlayItems();
            });
        }

        function hidePreview() {
            canvas.remove(overlay);
            overlay = undefined;

            canvas.forEachObject(function(o) {
                if (o.id != 'background') {
                    o.selectable = true;
                }
            });
            
            hideOverlayItems();
        }

        function showRedoUndo() {
            topControls.find('.canvas-constructor-undo, .canvas-constructor-redo').addClass('visible');
        }

        function hideRedoUndo() {
            topControls.find('.canvas-constructor-undo, .canvas-constructor-redo').removeClass('visible');
        }

        function updateRedoUndo() {
            var object = canvas.getActiveObject();
            topControls.find('.disabled').removeClass('disabled');

            if ( object.currentStateIndex == (object.states.length - 1) || object.states.length == 0 ) {
                $('.canvas-constructor-redo').addClass('disabled');
            }
            if ( object.currentStateIndex == 0 ) {
                $('.canvas-constructor-undo').addClass('disabled');
            }
        }
        
        function saveState(object) {
            if ( object.currentStateIndex != object.states.length - 1 ) {
                var elementsToDelete = (object.states.length - object.currentStateIndex) - 1;
                object.states.splice( (object.currentStateIndex + 1), elementsToDelete );
            }
            object.states.push( JSON.stringify( object.saveState() ) );
            object.currentStateIndex = object.states.length - 1;
        }

        function undo() {
            var object = canvas.getActiveObject();

            if ( object.currentStateIndex != 0 ) {
                object.setOptions( JSON.parse( object.states[ --object.currentStateIndex ] ) );
            }

            if ( object.type == 'text' ) {
                var index = texts.indexOf(object);
                options.find( '.canvas-constructor-texts-editors-list-item[data-text-editor-index="' + index + '"] .canvas-constructor-textarea')
                    .val(object.text);

                texts[index].picker.fromString( object.fill );
                checkLineHeightControls();
            }

            object.setCoords();
            canvas.renderAll();
        }

        function redo() {
            var object = canvas.getActiveObject();

            if ( object.currentStateIndex != object.states.length - 1 ) {
                object.setOptions( JSON.parse( object.states[ ++object.currentStateIndex ] ) );
            }

            if ( object.type == 'text' ) {
                var index = texts.indexOf(object);

                options.find( '.canvas-constructor-texts-editors-list-item[data-text-editor-index="' + index + '"] .canvas-constructor-textarea')
                    .val(object.text);

                texts[index].picker.fromString( object.fill );
                checkLineHeightControls();
            }

            object.setCoords();
            canvas.renderAll();
        }
        
        function setTransparentObjects(e) {
            canvas.forEachObject( function (o) {
                if (o != e.target && o.id != 'background') {
                    o.opacity = 0.5;
                }
            } );
            if ( canvas.getActiveObjects().length == 1 ) {
                e.target.opacity = 0.85;
            }
            else {
                var objects = canvas.getActiveObjects();

                for (var i = 0; i < objects.length; i++) {
                    objects[i].opacity = 0.85;
                }
            }
        }

        function checkLineHeightControls() {
            if ( canvas.getActiveObject().textLines.length > 1 ) {
                options.find('.text-editor-line-height').addClass('active');
                options.find('.text-editor-alignment-list').addClass('active');
            }
            else {
                options.find('.text-editor-line-height').removeClass('active');
                options.find('.text-editor-alignment-list').removeClass('active');
            }
        }

        function sendCanvasData() {
            var data = JSON.stringify( canvas.getObjects() );
          
            $.post( 'php/buy.php', {objects: data}, function (data) {
                    
            } );
        }

        return {
            init: init
        }
    }

    var constructor = Constructor();
    constructor.init();
    $('.canvas-constructor-loader-overlay').remove();
} ) );

