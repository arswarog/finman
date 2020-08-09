import React from 'react';
import { Header } from '../components/Header';
import { Main } from '../ui-kit/Main';
import { Icon, Icons } from '../ui-kit/Icon';
import { SectionTitle } from '../ui-kit/Section';

export const MainMenu = () => {
    return (
        <>
            <Header title="Menu"/>
            <Main>
                <div className="listview-title mt-1">Storage</div>
                <ul className="listview image-listview text inset"
                    style={{marginLeft: '0', marginRight: '0'}}>
                    <li>
                        <div className="item">
                            <div className="in">
                                <div>Subsets</div>
                                <span className="text-muted">0</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="item">
                            <div className="in">
                                <div>Accounts</div>
                                <span className="text-muted">1</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="item">
                            <div className="in">
                                <div>Month blocks</div>
                                <span className="text-muted">123</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="button item">
                            <div className="in">
                                <div>
                                    Remove all data
                                    <div className="text-muted">
                                        This action cannot be undone
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                {/*<div className="listview-title mt-1">Notifications</div>*/}
                {/*<ul className="listview image-listview text inset">*/}
                {/*    <li>*/}
                {/*        <div className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>*/}
                {/*                    Payment Alert*/}
                {/*                    <div className="text-muted">*/}
                {/*                        Send notification when new payment received*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="custom-control custom-switch">*/}
                {/*                    <input type="checkbox" className="custom-control-input" id="customSwitch4"/>*/}
                {/*                    <label className="custom-control-label" htmlFor="customSwitch4"/>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="#" className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>Notification Sound</div>*/}
                {/*                <span className="text-primary">Beep</span>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </li>*/}
                {/*</ul>*/}

                {/*<div className="listview-title mt-1">Profile Settings</div>*/}
                {/*<ul className="listview image-listview text inset">*/}
                {/*    <li>*/}
                {/*        <a href="#" className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>Change Username</div>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="#" className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>Update E-mail</div>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="#" className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>Address</div>*/}
                {/*                <span className="text-primary">Edit</span>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <div className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>*/}
                {/*                    Private Profile*/}
                {/*                </div>*/}
                {/*                <div className="custom-control custom-switch">*/}
                {/*                    <input type="checkbox" className="custom-control-input" id="customSwitch2"/>*/}
                {/*                    <label className="custom-control-label" htmlFor="customSwitch2"/>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </li>*/}
                {/*</ul>*/}

                {/*<div className="listview-title mt-1">Security</div>*/}
                {/*<ul className="listview image-listview text mb-2 inset">*/}
                {/*    <li>*/}
                {/*        <a href="#" className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>Update Password</div>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <div className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>*/}
                {/*                    2 Step Verification*/}
                {/*                </div>*/}
                {/*                <div className="custom-control custom-switch">*/}
                {/*                    <input type="checkbox" className="custom-control-input" id="customSwitch3"/>*/}
                {/*                    <label className="custom-control-label" htmlFor="customSwitch3"/>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="#" className="item">*/}
                {/*            <div className="in">*/}
                {/*                <div>Log out all devices</div>*/}
                {/*            </div>*/}
                {/*        </a>*/}
                {/*    </li>*/}
                {/*</ul>*/}
            </Main>
        </>
    );
};

