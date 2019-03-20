;
(function (win, doc) {
    var defaultMonth = [15, 30, 45, 60];
    var defaultSetting = {
        swiperOptions: {
            direction: 'vertical',
            centeredSlides: true,
            slidesPerView: 5,
            slideToClickedSlide: true
        }
    };

    function createId() {
        var id = parseInt(new Date().getTime() + Math.random() * 999999999);
        return "kinerDatePicker_" + id;
    }

    var tpl = '<div class="kinerDatePicker-container">' +
        '      <div class="kdp-mask"></div>' +
        '      <div class="kdp-box">' +
        '        <div class="kdp-header-container">' +
        '          <div class="kdp-cancel-btn">取消</div>' +
        '          <div class="kdp-ok-btn">    确定</div>' +
        '        </div>' +
        '        <div class="kdp-content-container">' +
        '          <div class="month-container">' +
        '            <div class="month-swiper-container">' +
        '              <div class="swiper-wrapper">' +
        '              </div>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        '    </div>'

    $.fn.kinerDatePicker = function (opts) {
        var opt = $.extend(true, {}, defaultSetting, opts);

        return $(this).each(function (index, item) {
            var self = this;

            this.container = $(tpl);
            this.pid = createId();
            this.container.attr('id', this.pid);
            $('body').append(this.container);

            this.container.find('.kdp-title').text(this.title);

            var monthTpl = '';
            for (var i = 1; i <= defaultMonth.length; i++) {
                monthTpl +=
                    '                <div class="swiper-slide" id="kdp_month_' + i + '">' +
                    '                  <div class="val" data-value="' + i + '">' + defaultMonth[i - 1] + '</div>' +
                    '                </div>';
            }
            this.container.find('.month-swiper-container .swiper-wrapper').html(monthTpl);

            var initIndex2 = $('#kdp_month_1').index();

            function hide() {
                $(self.container).find('.kdp-mask').fadeOut();
                $(self.container).find('.kdp-box').animate({
                    bottom: -$(win).height()
                }, function () {
                    $(self.container).css({
                        display: 'none'
                    })
                    opt.hideHandler && opt.hideHandler(self);
                });
            }

            function show() {
                $(self.container).find('.kdp-mask').fadeIn();
                if (self.yearSwiper) {

                    $(self.container).css({
                        display: 'block'
                    }).find('.kdp-box').animate({
                        bottom: 0
                    });
                } else {
                    $(self.container).css({
                        display: 'block'
                    });

                    var monthVal = $(self).attr('month-val') || 0;

                    self.monthSwiper = new Swiper('#' + self.pid + ' .month-swiper-container', $.extend(true, {}, opt.swiperOptions, {
                        initialSlide: monthVal,
                        on: {
                            slideChangeTransitionEnd: function () {
                                console.log(this.activeIndex + '=------------')
                                self.selectedMonth = this.activeIndex
                            }
                        }
                    }));

                    $(self.container).find('.kdp-box').animate({
                        bottom: 0
                    });
                }

                opt.showHandler && opt.showHandler(self);


            }

            $(self).click(function () {
                show();
            });
            if (opt.clickMaskHide) {
                this.container.find('.kdp-mask').click(function () {
                    hide();
                });
            }

            this.container.find('.kdp-cancel-btn').click(function () {
                hide();
                opt.cancelHandler && opt.cancelHandler(self);
            });
            this.container.find('.kdp-ok-btn').click(function () {
                var month = self.selectedMonth || 0;
                $(self).html(defaultMonth[month] + "%").addClass('hasValue');
                $(self).attr({
                    "month-val": month || ""
                });
                opt.okHandler && opt.okHandler(defaultMonth[month], self);
                hide();
            });
            $(self).getValue = function () {
                console.log("获取时间选择结果");
            }


        })
    };
})(window, document);