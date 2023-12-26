import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OtherSettings from "./OtherSettings";
import ChangePassword from "./ChangePassword";
import Settings from "./Settings";
import Profile from "./Profile";


const Stack = createNativeStackNavigator();

export default function NavigateStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name = "Setting " component = {Settings} />
            <Stack.Screen name="Profile" component={Profile}/>
            {/* <Stack.Screen name="Other Settings" component={OtherSettings}/> */}
            <Stack.Screen name="Reset Password" component={ChangePassword}/>
        </Stack.Navigator>
    );
}