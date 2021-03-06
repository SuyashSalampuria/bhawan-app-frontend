import React, { Suspense, lazy } from "react"
import { connect } from "react-redux"
import { Switch, Route, Link } from "react-router-dom"

import { Grid, Button, Segment } from "semantic-ui-react"

import { AppHeader, AppFooter, Loading } from "formula_one"

const Nav = lazy(() => import("./navbar/index"))
const BookRoom = lazy(() => import("./book_room/index"))
const ComplainRegister = lazy(() => import("./complain_register/index"))
const Authorities = lazy(() => import("./authorities/index"))
const Facilities = lazy(() => import("./facilities/index"))
const MyInfo = lazy(() => import("./my_info/index"))
const StudentDatabase = lazy(() => import("./student-database/index"))
const EventsCard = lazy(() => import("./events-card/index"))
const Events = lazy(() => import("./events/index"))
const AdminComplains = lazy(() => import("./admin-complaints/index"))
const BookingRequests = lazy(() => import("./booking_request/index"))
const Facility = lazy(() => import("./facility/index"))
const MyProfile = lazy(() => import("./my_profile/index"))
const AdminAuthorities = lazy(() => import("./admin_authorities/index"))
const EditAuthorities = lazy(() => import("./edit-authorities/index"))
const AddFacility = lazy(() => import("./add-facility/index"))
const RegisterStudent = lazy(() => import("./register_student/index"))

import { whoami } from "../actions/who_am_i";
import { getConstants } from "../actions/get-constants";
import { setActiveHostel } from "../actions/set-active-hostel";
import { setActivePost } from "../actions/set-active-post"
import { constantsUrl } from "../urls";

import main from "formula_one/src/css/app.css";
import blocks from "../css/app.css";

const creators = [
  {
    name: "Aman Sharma",
    role: "Mentor",
    link: "https://github.com/algomaster99/",
  },
  {
    name: "Suyash Salampuria",
    role: "Developer",
    link: "https://github.com/SuyashSalampuria/",
  },
  {
    name: "Ritvik Jain",
    role: "Developer",
    link: "https://github.com/ritvikjain99/",
  },
  {
    name: "Kashish Jagyasi",
    role: "Designer",
    link: "https://link.medium.com/eoXeYayNH5/",
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.state = {
      loading: true,
      consLoading: true,
      consLoaded: false,
      loaded: false,
      activeNav: "Home",
      isMobile: false,
      width: 0
    };
  }

  resize = () => {
    if (this.state.width !== window.innerWidth) {
      this.setState({
        width: window.innerWidth,
        isMobile: window.innerWidth <= 1000,
        columns: window.innerWidth <= 1000 ? 16: 12
      });
    }
  }

  changeActiveHostel = (hostelCode, designation) => {
    this.props.history.push('/bhawan_app/')
    this.props.setActiveHostel(hostelCode)
    this.props.setActivePost(designation)
  }

  setDefaultHostel = (hostel) => {
    if(hostel && hostel.length>0) {
      this.props.setActiveHostel(hostel[0][0])
      this.props.setActivePost(hostel[0][1])
    }
  }

  componentDidMount() {
    this.resize()
    this.props.getConstants(
      constantsUrl(),
      this.consSuccessCallBack,
      this.errCallBack
    )
  }

  setNavigation = (activeNav) => {
    this.setState({
      activeNav,
    })
  }

  successCallBack = (res) => {
    this.setDefaultHostel(res.data.hostel);
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      loaded: true,
      loading: false,
    });
  };

  consSuccessCallBack = (res) => {
    this.props.whoami(this.successCallBack, this.errCallBack)
    this.setState({
      success: true,
      error: false,
      message: res.statusText,
      consLoaded: true,
      consLoading: false,
    });
  };

  errCallBack = (err) => {
    this.setState({
      error: true,
      success: false,
      message: err,
      loading: false,
      loaded: true,
    });
  };

  render() {
    const { match, who_am_i, constants, activeHostel, activePost } = this.props;
    if (this.state.loaded && this.state.consLoaded) {
      if (activeHostel!='') {
        return (
          <div ref={this.divRef} styleName="blocks.app-wrapper">
            <Suspense fallback={<Loading />}>
              <Switch>
                <Route
                  path={`${match.path}`}
                  render={(props) => (
                    <AppHeader appName="bhawan_app" mode="app" userDropdown />
                  )}
                />
              </Switch>
              <Switch>
                <Route
                  path={`${match.path}`}
                  render={(props) => {
                    return (
                      <Nav
                        who_am_i={who_am_i}
                        constants={constants}
                        activeNav={this.state.activeNav}
                        changeActiveHostel={this.changeActiveHostel}
                        {...props}
                      />
                    );
                  }}
                />
              </Switch>
              <div styleName="blocks.app-container">
                <Grid container>
                  <Grid.Row>
                    <Route
                      path={`${match.path}profile`}
                      render={(props) => (
                        <MyProfile
                          who_am_i={who_am_i}
                          constants={constants}
                          setNavigation={this.setNavigation}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${match.path}book_room`}
                      exact
                      render={(props) =>
                        constants['administrative_council'].includes(activePost) && (
                          <BookingRequests
                            who_am_i={who_am_i}
                            constants={constants}
                            {...props}
                          />
                        )
                      }
                    />
                    <Route
                      path={`${match.path}facility`}
                      render={(props) => (
                        <Facility
                          who_am_i={who_am_i}
                          constants={constants}
                          setNavigation={this.setNavigation}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${match.path}admin_complain`}
                      exact
                      render={(props) => (
                        <AdminComplains
                          who_am_i={who_am_i}
                          constants={constants}
                          setNavigation={this.setNavigation}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${match.path}create-authority`}
                      render={(props) => (
                        <AdminAuthorities
                          who_am_i={who_am_i}
                          constants={constants}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={`${match.path}edit-authority`}
                      render={(props) => (
                        <EditAuthorities
                          who_am_i={who_am_i}
                          constants={constants}
                          {...props}
                        />
                      )}
                    />
                    <Switch>
                      <Route
                        path={`${match.path}book_room`}
                        exact
                        render={(props) =>
                          !constants['administrative_council'].includes(activePost) ? (
                            <BookRoom
                              who_am_i={who_am_i}
                              constants={constants}
                              setNavigation={this.setNavigation}
                            />
                          ): (
                            <div></div>
                          )
                        }
                      />
                      <Route
                        path={`${match.path}complain`}
                        exact
                        render={(props) => (
                          <ComplainRegister
                            who_am_i={who_am_i}
                            constants={constants}
                            setNavigation={this.setNavigation}
                            {...props}
                          />
                        )}
                      />
                      <Route
                        path={`${match.path}add/facility`}
                        render={(props) => <AddFacility who_am_i={who_am_i} {...this.props} />}
                      />

                      <Route
                        path={`${match.path}`}
                        exact
                        render={(props) => (
                          <Grid.Column width={this.state.columns} floated="left">
                            <Facilities
                              who_am_i={who_am_i}
                              setNavigation={this.setNavigation}
                              {...this.props}
                            />
                            <Authorities
                              who_am_i={who_am_i}
                              constants={constants}
                              {...this.props}
                            />
                          </Grid.Column>
                        )}
                      />
                      <Route
                        path={`${match.path}events`}
                        render={(props) => (
                          <Events
                            who_am_i={who_am_i}
                            setNavigation={this.setNavigation}
                          />
                        )}
                      />
                      <Route
                          path={`${match.path}database`}
                          render={(props) => (
                            <StudentDatabase
                             who_am_i={who_am_i}
                             setNavigation={this.setNavigation}
                             {...this.props}
                            />
                          )}
                        />
                        <Route
                          path={`${match.path}registration`}
                          render={(props) => (
                            <RegisterStudent
                             who_am_i={who_am_i}
                             setNavigation={this.setNavigation}
                             {...this.props}
                            />
                          )}
                        />
                    </Switch>
                    <Switch>
                      <Route
                        path={`${match.path}`}
                        exact
                        render={(props) => (
                          <Grid.Column width={3} floated="right" styleName="blocks.side-info">
                            <MyInfo {...props} who_am_i={who_am_i} constants={constants} activeHostel={activeHostel}/>
                            <EventsCard {...props} who_am_i={who_am_i} activeHostel={activeHostel} />
                            { constants['student_council'].includes(activePost) ? (
                              <Link to="/bhawan_app/admin_complain">
                                <Button fluid styleName="blocks.student-complains">
                                  Student Complains
                                </Button>
                              </Link>
                            ) : null}
                          </Grid.Column>
                        )}
                      />
                      <Route
                        path={`${match.path}complain`}
                        exact
                        render={(props) => (
                          <Grid.Column width={3} floated="right" styleName="blocks.side-info">
                            <MyInfo {...props} who_am_i={who_am_i} constants={constants} activeHostel={activeHostel} />
                            <EventsCard {...props} who_am_i={who_am_i} activeHostel={activeHostel} />
                          </Grid.Column>
                        )}
                      />
                      {!constants['administrative_council'].includes(activePost) && (
                        <Route
                          path={`${match.path}book_room`}
                          exact
                          render={(props) => (
                            <Grid.Column width={3} floated="right" styleName="blocks.side-info">
                              <MyInfo {...props} who_am_i={who_am_i} constants={constants} activeHostel={activeHostel}/>
                              <EventsCard {...props} who_am_i={who_am_i} activeHostel={activeHostel} />
                            </Grid.Column>
                          )}
                        />
                      )}
                      <Route
                        path={`${match.path}events`}
                        exact
                        render={(props) => (
                          <Grid.Column width={3} floated="right" styleName="blocks.side-info">
                            <EventsCard {...props} who_am_i={who_am_i} activeHostel={activeHostel} />
                          </Grid.Column>
                        )}
                      />
                    </Switch>
                  </Grid.Row>
                </Grid>
              </div>
            </Suspense>
            <AppFooter creators={creators} />
          </div>
        );
      } else {
        return (
          <React.Fragment>
            <Segment>Contact your Chief Warden. Your Bhawan details have not been filled</Segment>
          </React.Fragment>
        );
      }
    } else {
      return (
        <div styleName="blocks.content-div">
          <Loading />
        </div>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    who_am_i: state.who_am_i,
    constants: state.constants,
    activeHostel: state.activeHostel,
    activePost: state.activePost
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    whoami: (successCallBack, errCallBack) => {
      dispatch(whoami(successCallBack, errCallBack))
    },
    getConstants: (url, successCallBack, errCallBack) => {
      dispatch(getConstants(url, successCallBack, errCallBack))
    },
    setActiveHostel: (hostelCode) => {
      dispatch(setActiveHostel(hostelCode))
    },
    setActivePost: (designation) => {
      dispatch(setActivePost(designation))
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App)
