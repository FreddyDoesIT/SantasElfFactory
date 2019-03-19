    
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Wishes } from "../api/wishes.js";
import { Gifts } from "../api/gifts.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

class WishBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }

  getGiftName(giftId) {
    for (var i = 0; i < this.props.gifts.length; i++) {
      if (this.props.gifts[i]._id === giftId) {
        return this.props.gifts[i].name;
      }
    }
  }

  render() {
    if (!this.props.ready) {
      return <div>loading</div>;
    }
    return (
      <div className = "container">
        <div className="row">
          <div className="row">
            {this.props.wishes.map(wish => (
              <div key={wish._id} className="col-12">
                <div className = "container" >
                  <h5>{wish.username} asked for a <span id="giftName">{this.getGiftName(wish.giftId)}</span></h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

WishBoard.propTypes = {
  wishes: PropTypes.arrayOf(PropTypes.object).isRequired,
  gifts: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("wishes");
  const handle2 = Meteor.subscribe("gifts");

  return {
    wishes: Wishes.find({},{
      limit: 10,
      sort: {
        createdAt: -1
      }
    }).fetch(),
    gifts: Gifts.find({}).fetch(),
    user: Meteor.user(),
    ready : handle.ready() && handle2.ready()
  };
})(WishBoard);