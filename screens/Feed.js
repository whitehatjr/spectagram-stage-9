import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PostCard from "./PostCard";

import { FlatList } from "react-native-gesture-handler";

import firebase from "firebase";

export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            light_theme: true,
            posts: []
        };
    }

    fetchUser = () => {
        let theme;
        firebase
            .database()
            .ref("/users/" + firebase.auth().currentUser.uid)
            .on("value", (snapshot) => {
                theme = snapshot.val().current_theme
                this.setState({ light_theme: theme === "light" })
            })
    }

    componentDidMount() {
        this.fetchPosts();
        this.fetchUser();
    }

    fetchPosts = () => {
        firebase
            .database()
            .ref("/posts/")
            .on("value", (snapshot) => {
                let posts = []
                if (snapshot.val()) {
                    Object.keys(snapshot.val()).forEach(function (key) {
                        posts.push({
                            key: key,
                            value: snapshot.val()[key]
                        })
                    });
                }
                this.setState({ posts: posts })
                this.props.setUpdateToFalse();
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            })
    }


    renderItem = ({ item: post }) => {
        return <PostCard post={post} navigation={this.props.navigation} />;
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        return (
            <View style={this.state.light_theme ? styles.containerLight : styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.iconImage}
                        ></Image>
                    </View>
                    <View style={styles.appTitleTextContainer}>
                        <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>Spectagram</Text>
                    </View>
                </View>
                {
                    !this.state.posts[0] ?
                        <View style={styles.noPosts}>
                            <Text style={this.state.light_theme ? styles.noPostsTextLight : styles.noPostsText}>No Posts Available</Text>
                        </View> :
                        <View style={styles.cardContainer}>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.posts}
                                renderItem={this.renderItem}
                            />
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row"
    },
    appIcon: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    appTitleTextContainer: {
        flex: 0.8,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28),
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28)
    },
    cardContainer: {
        flex: 0.85
    },
    noPosts: {
        flex: 0.85,
        justifyContent: "center",
        alignItems: "center"
    },
    noPostsTextLight: {
        fontSize: RFValue(20),
    },
    noPostsText: {
        color: "white",
        fontSize: RFValue(20),
    }

});
