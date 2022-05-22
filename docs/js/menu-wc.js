'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">budgetify-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountsModule.html" data-type="entity-link" >AccountsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' : 'data-target="#xs-controllers-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' :
                                            'id="xs-controllers-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' }>
                                            <li class="link">
                                                <a href="controllers/AccountsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' : 'data-target="#xs-injectables-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' :
                                        'id="xs-injectables-links-module-AccountsModule-96e86882ffaa5a1c5d35352a96a576684b88e52596810886b25279ce9df2453018431bb24bb738113d6a80389fe0fa08d24d9f5a0d5e5580f50e6cac871e621b"' }>
                                        <li class="link">
                                            <a href="injectables/AccountsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-a52ab8add16bd980c12f31dff04e2e7bde98419d2f6d5e40b7a52b4740ecd29858f542924d70353713949bf862584e15e2654ea78019cdbee7116c94aa753cf9"' : 'data-target="#xs-controllers-links-module-AppModule-a52ab8add16bd980c12f31dff04e2e7bde98419d2f6d5e40b7a52b4740ecd29858f542924d70353713949bf862584e15e2654ea78019cdbee7116c94aa753cf9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-a52ab8add16bd980c12f31dff04e2e7bde98419d2f6d5e40b7a52b4740ecd29858f542924d70353713949bf862584e15e2654ea78019cdbee7116c94aa753cf9"' :
                                            'id="xs-controllers-links-module-AppModule-a52ab8add16bd980c12f31dff04e2e7bde98419d2f6d5e40b7a52b4740ecd29858f542924d70353713949bf862584e15e2654ea78019cdbee7116c94aa753cf9"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' : 'data-target="#xs-controllers-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' :
                                            'id="xs-controllers-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' : 'data-target="#xs-injectables-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' :
                                        'id="xs-injectables-links-module-AuthModule-49b2779a56e7331f48e345a0242ceb592c8921d6882565e213328d08e76d1ba6c33d8cd4127ae5a34c12a731ffcddc8c1a337762e14b404dc1f81e7930d86cd6"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtRefreshTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoriesModule.html" data-type="entity-link" >CategoriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' : 'data-target="#xs-controllers-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' :
                                            'id="xs-controllers-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' }>
                                            <li class="link">
                                                <a href="controllers/CategoriesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoriesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' : 'data-target="#xs-injectables-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' :
                                        'id="xs-injectables-links-module-CategoriesModule-26ce3a39b364e00d58bbf02a5920b8ad9ee8936ea7d42c024cb88ed119b98a2ae7aa4f11af1d78209472f1354b452f1c3fa2320c92491945198a270052287a50"' }>
                                        <li class="link">
                                            <a href="injectables/CategoriesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoriesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link" >ConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' : 'data-target="#xs-injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' :
                                        'id="xs-injectables-links-module-ConfigModule-01797ee1239f9a492c29a5fb48e4324dc9b1a35c96267c1d8af8df7abf4b7a6f1a00f3a292405328296edb76d466eb2bb548aaf86a6f9b300ad5e80e4638a1c4"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ExchangeRateModule.html" data-type="entity-link" >ExchangeRateModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' : 'data-target="#xs-controllers-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' :
                                            'id="xs-controllers-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' }>
                                            <li class="link">
                                                <a href="controllers/ExchangerateController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExchangerateController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' : 'data-target="#xs-injectables-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' :
                                        'id="xs-injectables-links-module-ExchangeRateModule-f72918eb43873e8638b91d8cdb96de92edb8accb410b48f278343438d27ea6c1a6e2544e0de8247a3aa1109d9686e30d056fb9bfdf6d64a15167b84a01452969"' }>
                                        <li class="link">
                                            <a href="injectables/ExchangeRateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExchangeRateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SendGridModule.html" data-type="entity-link" >SendGridModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionsModule.html" data-type="entity-link" >TransactionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' : 'data-target="#xs-controllers-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' :
                                            'id="xs-controllers-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' }>
                                            <li class="link">
                                                <a href="controllers/TransactionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' : 'data-target="#xs-injectables-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' :
                                        'id="xs-injectables-links-module-TransactionsModule-ace6a338b813e211979675e81ea59ca4c15600d7f2ab389b8949b6157d7ec6ac73b01e89add1db031d4439ab661b795ddcb34e4b7a0c927edfbbdb9666e65d25"' }>
                                        <li class="link">
                                            <a href="injectables/TransactionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-9bbb6c48cd458382e5932fc99b6bab6f83f493f112a4794e8bda58d6b22c46ffd1a0da50f866bc498ce6961c286870559abacb366e717f5c3239c363dde34fc6"' : 'data-target="#xs-injectables-links-module-UsersModule-9bbb6c48cd458382e5932fc99b6bab6f83f493f112a4794e8bda58d6b22c46ffd1a0da50f866bc498ce6961c286870559abacb366e717f5c3239c363dde34fc6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-9bbb6c48cd458382e5932fc99b6bab6f83f493f112a4794e8bda58d6b22c46ffd1a0da50f866bc498ce6961c286870559abacb366e717f5c3239c363dde34fc6"' :
                                        'id="xs-injectables-links-module-UsersModule-9bbb6c48cd458382e5932fc99b6bab6f83f493f112a4794e8bda58d6b22c46ffd1a0da50f866bc498ce6961c286870559abacb366e717f5c3239c363dde34fc6"' }>
                                        <li class="link">
                                            <a href="injectables/UserRefreshTokensService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRefreshTokensService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AccountsController.html" data-type="entity-link" >AccountsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CategoriesController.html" data-type="entity-link" >CategoriesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ExchangerateController.html" data-type="entity-link" >ExchangerateController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TransactionsController.html" data-type="entity-link" >TransactionsController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/AccountEntity.html" data-type="entity-link" >AccountEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CategoryEntity.html" data-type="entity-link" >CategoryEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TransactionEntity.html" data-type="entity-link" >TransactionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserRefreshTokenEntity.html" data-type="entity-link" >UserRefreshTokenEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/accounts1644744884181.html" data-type="entity-link" >accounts1644744884181</a>
                            </li>
                            <li class="link">
                                <a href="classes/AllExceptionFilter.html" data-type="entity-link" >AllExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/categories1644767124120.html" data-type="entity-link" >categories1644767124120</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmationEmailDto.html" data-type="entity-link" >ConfirmationEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountDto.html" data-type="entity-link" >CreateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryDto.html" data-type="entity-link" >CreateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link" >CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTransactionDto.html" data-type="entity-link" >CreateTransactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CredentialsDto.html" data-type="entity-link" >CredentialsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurrencyBaseParamDto.html" data-type="entity-link" >CurrencyBaseParamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CurrencyRateDto.html" data-type="entity-link" >CurrencyRateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExchangeRateProcessor.html" data-type="entity-link" >ExchangeRateProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindManyOptionsDto.html" data-type="entity-link" >FindManyOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindOneOptionsDto.html" data-type="entity-link" >FindOneOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ID.html" data-type="entity-link" >ID</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtAccessTokenPayloadDto.html" data-type="entity-link" >JwtAccessTokenPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtRefreshTokenDto.html" data-type="entity-link" >JwtRefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtRefreshTokenPayloadDto.html" data-type="entity-link" >JwtRefreshTokenPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JwtTokensDto.html" data-type="entity-link" >JwtTokensDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MockExchangeRateProcessor.html" data-type="entity-link" >MockExchangeRateProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationTransactionsDto.html" data-type="entity-link" >PaginationTransactionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectAccountsDto.html" data-type="entity-link" >SelectAccountsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectCategoriesDto.html" data-type="entity-link" >SelectCategoriesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectProfileDto.html" data-type="entity-link" >SelectProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectTransactionsDto.html" data-type="entity-link" >SelectTransactionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectUserDto.html" data-type="entity-link" >SelectUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectUsersDto.html" data-type="entity-link" >SelectUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendResetPasswordDto.html" data-type="entity-link" >SendResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAccountDto.html" data-type="entity-link" >UpdateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCategoryDto.html" data-type="entity-link" >UpdateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEmailDto.html" data-type="entity-link" >UpdateEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link" >UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTransactionDto.html" data-type="entity-link" >UpdateTransactionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/user1615673396368.html" data-type="entity-link" >user1615673396368</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccountsService.html" data-type="entity-link" >AccountsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoriesService.html" data-type="entity-link" >CategoriesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link" >ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExchangeRateService.html" data-type="entity-link" >ExchangeRateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshGuard.html" data-type="entity-link" >JwtRefreshGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link" >JwtRefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SendGridService.html" data-type="entity-link" >SendGridService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransactionsService.html" data-type="entity-link" >TransactionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformInterceptor.html" data-type="entity-link" >TransformInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRefreshTokensService.html" data-type="entity-link" >UserRefreshTokensService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CreateMockFileReturn.html" data-type="entity-link" >CreateMockFileReturn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link" >Response</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendGridModuleAsyncOptions.html" data-type="entity-link" >SendGridModuleAsyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendGridModuleOptions.html" data-type="entity-link" >SendGridModuleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SendGridOptionsFactory.html" data-type="entity-link" >SendGridOptionsFactory</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="unit-test.html"><span class="icon ion-ios-podium"></span>Unit test coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});