import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";

import firebase from "firebase";

export default class PostScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            light_theme: true,
            likes: this.props.route.params.value.likes,
            is_liked: false
        };
    }

    componentDidMount() {
        this.fetchUser();
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

    likeAction = () => {
        if (this.state.is_liked) {
            firebase
                .database()
                .ref("posts")
                .child(this.props.route.params.key)
                .child("likes")
                .set(firebase.database.ServerValue.increment(-1));
            this.setState({ likes: (this.state.likes -= 1), is_liked: false });
        } else {
            firebase
                .database()
                .ref("posts")
                .child(this.props.route.params.key)
                .child("likes")
                .set(firebase.database.ServerValue.increment(1));
            this.setState({ likes: (this.state.likes += 1), is_liked: true });
        }
    };

    render() {
        if (!this.props.route.params.value) {
            this.props.navigation.navigate("Home");
        } else {
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
                    <View style={styles.postContainer}>
                        <ScrollView style={this.state.light_theme ? styles.postCardLight : styles.postCard}>
                            <View style={styles.authorContainer}>
                                <View style={styles.authorImageContainer}>
                                    <Image
                                        source={{ uri: this.props.route.params.value.profile_image }}
                                        style={styles.profileImage}
                                    ></Image>
                                </View>
                                <View style={styles.authorNameContainer}>
                                    <Text style={this.state.light_theme ? styles.authorNameTextLight : styles.authorNameText}>{this.props.route.params.value.author}</Text>
                                </View>
                            </View>
                            <Image source={require("../assets/image_1.jpg")} style={styles.postImage} />
                            <View style={styles.captionContainer}>
                                <Text style={this.state.light_theme ? styles.captionTextLight : styles.captionText}>
                                    {this.props.route.params.value.caption}
                                </Text>
                            </View>
                            <View style={styles.actionContainer}>
                                <TouchableOpacity
                                    style={
                                        this.state.is_liked
                                            ? styles.likeButtonLiked
                                            : styles.likeButtonDisliked
                                    }
                                    onPress={() => this.likeAction()}
                                >
                                    <Ionicons
                                        name={"heart"}
                                        size={RFValue(30)}
                                        color={this.state.light_theme ? "black" : "white"}
                                    />

                                    <Text
                                        style={
                                            this.state.light_theme
                                                ? styles.likeTextLight
                                                : styles.likeText
                                        }
                                    >
                                        {this.state.likes}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            );
        }
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
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    appTitleTextContainer: {
        flex: 0.7,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28)
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28),
    },
    postContainer: {
        flex: 1
    },
    postCard: {
        margin: RFValue(20),
        backgroundColor: "#2a2a2a",
        borderRadius: RFValue(20)
    },
    postCardLight: {
        margin: RFValue(20),
        backgroundColor: "#eaeaea",
        borderRadius: RFValue(20)
    },
    actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
    },
    likeButtonLiked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#eb3948",
        borderRadius: RFValue(30)
    },
    likeButtonDisliked: {
        width: RFValue(160),
        height: RFValue(40),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        borderColor: "#eb3948",
        borderWidth: 2,
        borderRadius: RFValue(30)
    },
    likeText: {
        color: "white",
        fontSize: 25,
        marginLeft: 25,
        marginTop: 6
    },
    likeTextLight: {
        fontSize: 25,
        marginLeft: 25,
        marginTop: 6
    },
    authorContainer: {
        height: RFPercentage(10),
        padding: RFValue(10),
        flexDirection: "row"
    },
    authorImageContainer: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        borderRadius: RFValue(100)
    },
    authorNameContainer: {
        flex: 0.85,
        padding: RFValue(10),
        justifyContent: "center"
    },
    authorNameText: {
        color: "white",
        fontSize: RFValue(20)
    },
    authorNameTextLight: {
        color: "black",
        fontSize: RFValue(20)
    },
    postImage: {
        width: "100%",
        alignSelf: "center",
        height: RFValue(200),
        borderTopLeftRadius: RFValue(20),
        borderTopRightRadius: RFValue(20),
        resizeMode: "contain"
    },
    captionContainer: {
        padding: RFValue(10)
    },
    captionText: {
        fontSize: 13,
        color: "white",
        paddingTop: RFValue(10)
    },
    captionTextLight: {
        fontSize: 13,
        color: "black",
        paddingTop: RFValue(10)
    },
});
