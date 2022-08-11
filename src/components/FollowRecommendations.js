/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";

import '../css/FollowRecommendations.css';

export default function FollowRecommendations(props) {

    let [recommendations, setNewRecommendations] = useState([]);

    useEffect(() => {
        getRecommendations();

        let refreshId = setInterval(() => {
            getRecommendations();
        }, 100000);

        return () => {
            clearInterval(refreshId);
        }
    }, []);

    function getRecommendations() {
        if (props.currentUserProp) {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + (props.currentUserProp ? props.currentUserProp.jwt_token : null)
                }
            }

            axios.post('https://akademia108.pl/api/social-app/follows/recommendations',
                {},
                axiosConfig
            )
            .then(res => {
                setNewRecommendations(res.data);
            })
            .catch(err => {
                console.log(`Recommendations' query caused this error: ${err} `);
                props.clearUserMethod();

                //clearInterval(refreshId);
                //return false;
            });
        }
    }

    function follow(id) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.currentUserProp.jwt_token 
            }
        }

        axios.post(
            "https://akademia108.pl/api/social-app/follows/follow",
            { leader_id: id },
            axiosConfig
        )
        .then(() => {
            props.getPostsLatest();
        })
        .catch((error) => {
            console.error(error);
            props.clearUserMethod();
        });
    }

    let recommendationsList = recommendations.map(recommendation => {
        return (
            <div className="recommendation" key={recommendation.id}>
                <div className="avatar-holder">
                    <img src={recommendation.avatar_url} alt="userPhoto" />
                </div>
                <p className="user-name">
                    {recommendation.username}
                </p>  
                <button className="btn follow-btn" onClick={() => follow(recommendation.id)}>
                    Follow
                </button>
            </div>
        )

    })

    return (
        <div className="recommendations">
            {recommendationsList}
        </div>
    )
}

