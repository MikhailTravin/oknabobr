//Селект
class SelectConstructor {
    constructor(props, data = null) {
        let defaultConfig = {
            init: true,
            logging: true,
            speed: 150
        }
        this.config = Object.assign(defaultConfig, props);
        this.selectClasses = {
            classSelect: "select", // Главный блок
            classSelectBody: "select__body", // Тело селекта
            classSelectTitle: "select__title", // Заголовок
            classSelectValue: "select__value", // Значение в заголовке
            classSelectLabel: "select__label", // Лейбл (метка)
            classSelectInput: "select__input", // Поле ввода
            classSelectText: "select__text", // Оболочка текстовых данных
            classSelectLink: "select__link", // Ссылка в элементе
            classSelectOptions: "select__options", // Выпадающий список
            classSelectOptionsScroll: "select__scroll", // Оболочка при скролле
            classSelectOption: "select__option", // Пункт
            classSelectContent: "select__content", // Оболочка контента в заголовке
            classSelectRow: "select__row", // Ряд
            classSelectData: "select__asset", // Дополнительные данные
            classSelectDisabled: "_select-disabled", // Заблокировано
            classSelectTag: "_select-tag", // Класс тега
            classSelectOpen: "_select-open", // Список открыт
            classSelectActive: "_select-active", // Список выбран
            classSelectFocus: "_select-focus", // Список в фокусе
            classSelectMultiple: "_select-multiple", // Множественный выбор
            classSelectCheckBox: "_select-checkbox", // Стиль чекбокса
            classSelectOptionSelected: "_select-selected", // Выбранный пункт
            classSelectPseudoLabel: "_select-pseudo-label", // Псевдолейбл
        }
        this._this = this;
        if (this.config.init) {
            const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll('select');
            if (selectItems.length) {
                this.selectsInit(selectItems);
            }
        }
    }

    getSelectClass(className) {
        return `.${className}`;
    }

    getSelectElement(selectItem, className) {
        return {
            originalSelect: selectItem.querySelector('select'),
            selectElement: selectItem.querySelector(this.getSelectClass(className)),
        }
    }

    selectsInit(selectItems) {
        selectItems.forEach((originalSelect, index) => {
            this.selectInit(originalSelect, index + 1);
        });

        document.addEventListener('click', function (e) {
            this.selectsActions(e);
        }.bind(this));

        document.addEventListener('keydown', function (e) {
            this.selectsActions(e);
        }.bind(this));

        document.addEventListener('focusin', function (e) {
            this.selectsActions(e);
        }.bind(this));

        document.addEventListener('focusout', function (e) {
            this.selectsActions(e);
        }.bind(this));
    }

    selectInit(originalSelect, index) {
        const _this = this;
        let selectItem = document.createElement("div");
        selectItem.classList.add(this.selectClasses.classSelect);

        originalSelect.parentNode.insertBefore(selectItem, originalSelect);

        selectItem.appendChild(originalSelect);

        originalSelect.hidden = true;

        index ? originalSelect.dataset.id = index : null;

        if (this.getSelectPlaceholder(originalSelect)) {
            originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
            if (this.getSelectPlaceholder(originalSelect).label.show) {
                const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
            }
        }

        selectItem.insertAdjacentHTML('beforeend', `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);

        this.selectBuild(originalSelect);

        originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
        this.config.speed = +originalSelect.dataset.speed;

        originalSelect.addEventListener('change', function (e) {
            _this.selectChange(e);
        });
    }

    selectBuild(originalSelect) {
        const selectItem = originalSelect.parentElement;
        selectItem.dataset.id = originalSelect.dataset.id;

        originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;

        originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);

        originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);

        this.setSelectTitleValue(selectItem, originalSelect);

        this.setOptions(selectItem, originalSelect);

        originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;

        originalSelect.hasAttribute('data-open') ? this.selectAction(selectItem) : null;

        this.selectDisabled(selectItem, originalSelect);
    }

    selectsActions(e) {
        const targetElement = e.target;
        const targetType = e.type;

        if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
            const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
            const originalSelect = this.getSelectElement(selectItem).originalSelect;

            if (targetType === 'click') {
                if (!originalSelect.disabled) {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) {
                        this.selectAction(selectItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                }
            } else if (targetType === 'focusin' || targetType === 'focusout') {
                if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) {
                    targetType === 'focusin' ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                }
            } else if (targetType === 'keydown' && e.code === 'Escape') {
                this.selectsСlose();
            }
        } else {
            this.selectsСlose();
        }
    }

    selectsСlose(selectOneGroup) {
        const selectsGroup = selectOneGroup ? selectOneGroup : document;
        const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
        if (selectActiveItems.length) {
            selectActiveItems.forEach(selectActiveItem => {
                this.selectСlose(selectActiveItem);
            });
        }
    }

    selectСlose(selectItem) {
        const originalSelect = this.getSelectElement(selectItem).originalSelect;
        const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
        if (!selectOptions.classList.contains('_slide')) {
            selectItem.classList.remove(this.selectClasses.classSelectOpen);
            _slideUp(selectOptions, originalSelect.dataset.speed);
            setTimeout(() => {
                selectItem.style.zIndex = '';
            }, originalSelect.dataset.speed);
        }
    }

    selectAction(selectItem) {
        const originalSelect = this.getSelectElement(selectItem).originalSelect;
        const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
        const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;

        this.setOptionsPosition(selectItem);
        this.selectsСlose();

        setTimeout(() => {
            if (!selectOptions.classList.contains('_slide')) {
                selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                _slideToggle(selectOptions, originalSelect.dataset.speed);

                if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
                } else {
                    setTimeout(() => {
                    }, originalSelect.dataset.speed);
                }
            }
        }, 0);
    }

    setSelectTitleValue(selectItem, originalSelect) {
        const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
        const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
        if (selectItemTitle) selectItemTitle.remove();
        selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
        originalSelect.hasAttribute('data-search') ? this.searchActions(selectItem) : null;
    }

    getSelectTitleValue(selectItem, originalSelect) {
        let selectTitleValue = '';

        const isCalculatorSelect = selectItem.closest('.top-calculator__left');

        if (!originalSelect.multiple) {
            const selectedOption = originalSelect.options[originalSelect.selectedIndex];
            if (selectedOption && selectedOption.value) {
                selectTitleValue = selectedOption.textContent.trim();
            } else {
                selectTitleValue = selectedOption ? selectedOption.textContent.trim() : '';
            }
        } else {
            selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;

            if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`).join('');
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
                }
            }
        }

        if (!selectTitleValue || (originalSelect.multiple && !this.getSelectedOptionsData(originalSelect).values.length)) {
            selectTitleValue = originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : '';
        }

        let pseudoAttribute = '';
        let pseudoAttributeClass = '';
        if (originalSelect.hasAttribute('data-pseudo-label')) {
            pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
            pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
        }

        if (!isCalculatorSelect) {
            if (!originalSelect.multiple) {
                const selectedOption = originalSelect.options[originalSelect.selectedIndex];
                if (selectedOption && selectedOption.value) {
                    selectItem.classList.add(this.selectClasses.classSelectActive);
                } else {
                    selectItem.classList.remove(this.selectClasses.classSelectActive);
                }
            } else {
                this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            }
        }

        const selectedOption = originalSelect.options[originalSelect.selectedIndex];
        const selectedImage = selectedOption ? selectedOption.dataset.image : '';
        const imageHTML = selectedImage ? `<img src="${selectedImage}" alt="" class="select__image">` : '';

        if (originalSelect.hasAttribute('data-search')) {
            return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}">${imageHTML}<input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
        } else {
            const customClass = selectedOption && selectedOption.dataset.class ? ` ${selectedOption.dataset.class}` : '';

            if (isCalculatorSelect) {
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span class="${this.selectClasses.classSelectValue}">${imageHTML}<span class="${this.selectClasses.classSelectContent}">${selectTitleValue}</span></span></button>`;
            } else {
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}">${imageHTML}<span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
    }

    getSelectElementContent(selectOption) {
        const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
        const selectOptionImage = selectOption.hasAttribute('data-image') ? selectOption.dataset.image : '';
        const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
        const selectOptionImageHTML = selectOptionImage ? `<img src="${selectOptionImage}" alt="" class="select__image">` : '';

        let selectOptionContentHTML = ``;
        selectOptionContentHTML += (selectOptionData || selectOptionImage) ? `<span class="${this.selectClasses.classSelectRow}">` : '';
        selectOptionContentHTML += (selectOptionData || selectOptionImage) ? `<span class="${this.selectClasses.classSelectData}">` : '';
        selectOptionContentHTML += selectOptionImage ? selectOptionImageHTML : '';
        selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
        selectOptionContentHTML += (selectOptionData || selectOptionImage) ? `</span>` : '';
        selectOptionContentHTML += (selectOptionData || selectOptionImage) ? `<span class="${this.selectClasses.classSelectText}">` : '';
        selectOptionContentHTML += selectOption.textContent;
        selectOptionContentHTML += (selectOptionData || selectOptionImage) ? `</span>` : '';
        selectOptionContentHTML += (selectOptionData || selectOptionImage) ? `</span>` : '';
        return selectOptionContentHTML;
    }

    getSelectPlaceholder(originalSelect) {
        const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
        if (selectPlaceholder) {
            return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            }
        }
    }

    getSelectedOptionsData(originalSelect, type) {
        let selectedOptions = [];
        if (originalSelect.multiple) {
            selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
        } else {
            selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
        }
        return {
            elements: selectedOptions.map(option => option),
            values: selectedOptions.filter(option => option.value).map(option => option.value),
            html: selectedOptions.map(option => this.getSelectElementContent(option))
        }
    }

    getOptions(originalSelect) {
        const selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
        const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;

        let selectOptions = Array.from(originalSelect.options);
        if (selectOptions.length > 0) {
            let selectOptionsHTML = ``;

            if ((this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
                selectOptions = selectOptions.filter(option => option.value);
            }

            selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ''} class="${this.selectClasses.classSelectOptionsScroll}">`;

            selectOptions.forEach(selectOption => {
                selectOptionsHTML += this.getOption(selectOption, originalSelect);
            });

            selectOptionsHTML += `</div>`;
            return selectOptionsHTML;
        }
    }

    getOption(selectOption, originalSelect) {
        const selectOptionSelected = selectOption.selected ? ` ${this.selectClasses.classSelectOptionSelected}` : '';

        const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') && !originalSelect.multiple && selectOption.value ? `hidden` : ``;

        const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
        const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
        const selectOptionLinkTarget = selectOption.hasAttribute('data-href-blank') ? `target="_blank"` : '';

        let selectOptionHTML = ``;
        selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
        selectOptionHTML += this.getSelectElementContent(selectOption);
        selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
        return selectOptionHTML;
    }

    setOptions(selectItem, originalSelect) {
        const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
        selectItemOptions.innerHTML = this.getOptions(originalSelect);
    }

    setOptionsPosition(selectItem) {
        const originalSelect = this.getSelectElement(selectItem).originalSelect;
        const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
        const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
        const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
        const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;

        if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
            selectOptions.hidden = false;
            const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue('max-height'));
            const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
            const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
            selectOptions.hidden = true;

            const selectItemHeight = selectItem.offsetHeight;
            const selectItemPos = selectItem.getBoundingClientRect().top;
            const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
            const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

            if (selectItemResult < 0) {
                const newMaxHeightValue = selectOptionsHeight + selectItemResult;
                if (newMaxHeightValue < 100) {
                    selectItem.classList.add('select--show-top');
                    selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
                } else {
                    selectItem.classList.remove('select--show-top');
                    selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
                }
            }
        } else {
            setTimeout(() => {
                selectItem.classList.remove('select--show-top');
                selectItemScroll.style.maxHeight = customMaxHeightValue;
            }, +originalSelect.dataset.speed);
        }
    }

    optionAction(selectItem, originalSelect, optionItem) {
        const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
        if (!selectOptions.classList.contains('_slide')) {
            if (originalSelect.multiple) {
                optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
                    originalSelectSelectedItem.removeAttribute('selected');
                });

                const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                selectSelectedItems.forEach(selectSelectedItems => {
                    originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
                });
            } else {
                if (!originalSelect.hasAttribute('data-show-selected')) {
                    setTimeout(() => {
                        const hiddenOptions = selectItem.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`);
                        hiddenOptions.forEach(option => {
                            option.hidden = false;
                        });
                        if (optionItem.dataset.value) {
                            optionItem.hidden = true;
                        }
                    }, this.config.speed);
                }

                const newValue = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
                originalSelect.value = newValue;

                const changeEvent = new Event('change', { bubbles: true });
                originalSelect.dispatchEvent(changeEvent);

                this.selectAction(selectItem);
            }

            this.setSelectTitleValue(selectItem, originalSelect);
            this.setSelectChange(originalSelect);
        }
    }

    selectChange(e) {
        const originalSelect = e.target;
        this.selectBuild(originalSelect);
        this.setSelectChange(originalSelect);
    }

    setSelectChange(originalSelect) {
        if (originalSelect.hasAttribute('data-validate')) {
            formValidate.validateInput(originalSelect);
        }

        if (originalSelect.hasAttribute('data-submit') && originalSelect.value) {
            let tempButton = document.createElement("button");
            tempButton.type = "submit";
            originalSelect.closest('form').append(tempButton);
            tempButton.click();
            tempButton.remove();
        }

        const selectItem = originalSelect.parentElement;
        this.selectCallback(selectItem, originalSelect);
    }

    selectDisabled(selectItem, originalSelect) {
        if (originalSelect.disabled) {
            selectItem.classList.add(this.selectClasses.classSelectDisabled);
            this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
        } else {
            selectItem.classList.remove(this.selectClasses.classSelectDisabled);
            this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
        }
    }

    searchActions(selectItem) {
        const originalSelect = this.getSelectElement(selectItem).originalSelect;
        const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
        const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
        const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
        const _this = this;

        selectInput.addEventListener("input", function () {
            selectOptionsItems.forEach(selectOptionsItem => {
                if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) {
                    selectOptionsItem.hidden = false;
                } else {
                    selectOptionsItem.hidden = true;
                }
            });
            selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
        });
    }

    selectCallback(selectItem, originalSelect) {
        document.dispatchEvent(new CustomEvent("selectCallback", {
            detail: {
                select: originalSelect
            }
        }));
    }
}

modules_flsModules.select = new SelectConstructor({});

//========================================================================================================================================================

//Попап
class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            attributeOpenButton: "data-popup",
            attributeCloseButton: "data-close",
            fixElementSelector: "[data-lp]",
            youtubeAttribute: "data-popup-youtube",
            youtubePlaceAttribute: "data-popup-youtube-place",
            setAutoplayYoutube: true,
            classes: {
                popup: "popup",
                popupContent: "popup__content",
                popupActive: "popup_show",
                bodyActive: "popup-show"
            },
            focusCatch: true,
            closeEsc: true,
            bodyLock: true,
            hashSettings: {
                goHash: true
            },
            on: {
                beforeOpen: function () { },
                afterOpen: function () { },
                beforeClose: function () { },
                afterClose: function () { }
            }
        };
        this.youTubeCode;
        this.isOpen = false;
        this.targetOpen = {
            selector: false,
            element: false
        };
        this.previousOpen = {
            selector: false,
            element: false
        };
        this.lastClosed = {
            selector: false,
            element: false
        };
        this._dataValue = false;
        this.hash = false;
        this._reopen = false;
        this._selectorOpen = false;
        this.lastFocusEl = false;
        this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings
            },
            on: {
                ...config.on,
                ...options?.on
            }
        };
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null;
    }
    initPopups() {
        this.eventsPopup();
    }
    eventsPopup() {
        document.addEventListener("click", function (e) {
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                if ("error" !== this._dataValue) {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;
                }
                return;
            }
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this));
        if (this.options.hashSettings.goHash) {
            window.addEventListener("hashchange", function () {
                if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
            }.bind(this));
            window.addEventListener("load", function () {
                if (window.location.hash) this._openToHash();
            }.bind(this));
        }
    }
    open(selectorValue) {
        if (bodyLockStatus) {
            this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;
            this.targetOpen.element = document.querySelector(this.targetOpen.selector);
            if (this.targetOpen.element) {
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                    const iframe = document.createElement("iframe");
                    iframe.setAttribute("allowfullscreen", "");
                    const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                    iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                    iframe.setAttribute("src", urlVideo);
                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                const videoElement = this.targetOpen.element.querySelector("video");
                if (videoElement) {
                    videoElement.muted = true;
                    videoElement.currentTime = 0;
                    videoElement.play().catch((e => console.error("Autoplay error:", e)));
                }
                if (this.options.hashSettings.location) {
                    this._getHash();
                    this._setHash();
                }
                this.options.on.beforeOpen(this);
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);
                if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                this.targetOpen.element.setAttribute("aria-hidden", "false");
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;
                this._selectorOpen = false;
                this.isOpen = true;
                this.options.on.afterOpen(this);
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
            }
        }
    }
    close(selectorValue) {
        if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
        if (!this.isOpen || !bodyLockStatus) return;
        this.options.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));
        if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        const videoElement = this.previousOpen.element.querySelector("video");
        if (videoElement) videoElement.pause();
        this.previousOpen.element.setAttribute("aria-hidden", "true");
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));
    }
    _getHash() {
        if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
    }
    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
        if (buttons && classInHash) this.open(classInHash);
    }
    _setHash() {
        history.pushState("", "", this.hash);
    }
    _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        if (e.shiftKey && 0 === focusedIndex) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
    bodyLock();
    document.documentElement.classList.add("menu-open");
}
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================


//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
    document.body.addEventListener("focusin", function (e) {
        const targetElement = e.target;
        if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
            if (!targetElement.hasAttribute('data-no-focus-classes')) {
                targetElement.classList.add('_form-focus');
                targetElement.parentElement.classList.add('_form-focus');
            }
            formValidate.removeError(targetElement);
            targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
        }
    });
    document.body.addEventListener("focusout", function (e) {
        const targetElement = e.target;
        if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
            if (!targetElement.hasAttribute('data-no-focus-classes')) {
                targetElement.classList.remove('_form-focus');
                targetElement.parentElement.classList.remove('_form-focus');
            }
            targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;
        }
    });
    if (options.viewPass) {
        document.addEventListener("click", function (e) {
            const targetElement = e.target;
            if (targetElement.closest('.form__viewpass')) {
                const viewpassBlock = targetElement.closest('.form__viewpass');
                const input = viewpassBlock.closest('.form__input').querySelector('input');

                if (input) {
                    const isActive = viewpassBlock.classList.contains('_viewpass-active');
                    input.setAttribute("type", isActive ? "password" : "text");
                    viewpassBlock.classList.toggle('_viewpass-active');
                } else {
                    console.error('Input не найден!');
                }
            }
        });
    }
    if (options.autoHeight) {
        const textareas = document.querySelectorAll('textarea[data-autoheight]');
        if (textareas.length) {
            textareas.forEach(textarea => {
                const startHeight = textarea.hasAttribute('data-autoheight-min') ?
                    Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
                    Number(textarea.dataset.autoheightMax) : Infinity;
                setHeight(textarea, Math.min(startHeight, maxHeight))
                textarea.addEventListener('input', () => {
                    if (textarea.scrollHeight > startHeight) {
                        textarea.style.height = `auto`;
                        setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                    }
                });
            });
            function setHeight(textarea, height) {
                textarea.style.height = `${height}px`;
            }
        }
    }
}
formFieldsInit({
    viewPass: true,
    autoHeight: false
});
let formValidate = {
    getErrors(form) {
        let error = 0;
        let formRequiredItems = form.querySelectorAll('*[data-required]');
        if (formRequiredItems.length) {
            formRequiredItems.forEach(formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
                    error += this.validateInput(formRequiredItem);
                }
            });
        }
        return error;
    },
    validateInput(formRequiredItem) {
        let error = 0;

        if (formRequiredItem.dataset.required === "email") {
            formRequiredItem.value = formRequiredItem.value.replace(" ", "");
            if (this.emailTest(formRequiredItem)) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
        } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
            this.addError(formRequiredItem);
            this.removeSuccess(formRequiredItem);
            error++;
        } else if (formRequiredItem.dataset.validate === "password-confirm") {
            const passwordInput = document.getElementById('password');
            if (!passwordInput) return error;

            if (formRequiredItem.value !== passwordInput.value) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
        } else {
            if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
        }

        return error;
    },
    addError(formRequiredItem) {
        formRequiredItem.classList.add('_form-error');
        formRequiredItem.parentElement.classList.add('_form-error');
        let inputError = formRequiredItem.parentElement.querySelector('.form__error');
        if (inputError) formRequiredItem.parentElement.removeChild(inputError);
        if (formRequiredItem.dataset.error) {
            formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        }
    },
    removeError(formRequiredItem) {
        formRequiredItem.classList.remove('_form-error');
        formRequiredItem.parentElement.classList.remove('_form-error');
        if (formRequiredItem.parentElement.querySelector('.form__error')) {
            formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
        }
    },
    addSuccess(formRequiredItem) {
        formRequiredItem.classList.add('_form-success');
        formRequiredItem.parentElement.classList.add('_form-success');
    },
    removeSuccess(formRequiredItem) {
        formRequiredItem.classList.remove('_form-success');
        formRequiredItem.parentElement.classList.remove('_form-success');
    },
    formClean(form) {
        form.reset();
        setTimeout(() => {
            let inputs = form.querySelectorAll('input,textarea');
            for (let index = 0; index < inputs.length; index++) {
                const el = inputs[index];
                el.parentElement.classList.remove('_form-focus');
                el.classList.remove('_form-focus');
                formValidate.removeError(el);
            }
            let checkboxes = form.querySelectorAll('.checkbox__input');
            if (checkboxes.length > 0) {
                for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
            }
            if (flsModules.select) {
                let selects = form.querySelectorAll('div.select');
                if (selects.length) {
                    for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector('select');
                        flsModules.select.selectBuild(select);
                    }
                }
            }
        }, 0);
    },
    emailTest(formRequiredItem) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
    }
};
function formSubmit() {
    const forms = document.forms;
    if (forms.length) {
        for (const form of forms) {
            form.addEventListener('submit', function (e) {
                const form = e.target;
                formSubmitAction(form, e);
            });
            form.addEventListener('reset', function (e) {
                const form = e.target;
                formValidate.formClean(form);
            });
        }
    }
    async function formSubmitAction(form, e) {
        const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
        if (error === 0) {
            const ajax = form.hasAttribute('data-ajax');
            if (ajax) {
                e.preventDefault();
                const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
                const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
                const formData = new FormData(form);

                form.classList.add('_sending');
                const response = await fetch(formAction, {
                    method: formMethod,
                    body: formData
                });
                if (response.ok) {
                    let responseResult = await response.json();
                    form.classList.remove('_sending');
                    formSent(form, responseResult);
                } else {
                    alert("Помилка");
                    form.classList.remove('_sending');
                }
            } else if (form.hasAttribute('data-dev')) {
                e.preventDefault();
                formSent(form);
            }
        } else {
            e.preventDefault();
            if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
                const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
                gotoBlock(formGoToErrorClass, true, 1000);
            }
        }
    }
    function formSent(form, responseResult = ``) {
        document.dispatchEvent(new CustomEvent("formSent", {
            detail: {
                form: form
            }
        }));
        setTimeout(() => {
            if (flsModules.popup) {
                const popup = form.dataset.popupMessage;
                popup ? flsModules.popup.open(popup) : null;
            }
        }, 0);
        formValidate.formClean(form);
        formLogging(`Форма отправлена!`);
    }
    function formLogging(message) {
        FLS(`[Форма]: ${message}`);
    }
}
formSubmit()