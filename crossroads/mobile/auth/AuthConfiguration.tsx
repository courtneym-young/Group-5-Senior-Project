import { useTheme } from "@aws-amplify/ui-react-native";
import { View, Text } from "react-native";

export const AuthHeader = () => {
  const {
    tokens: { space, fontSizes },
  } = useTheme();
  return (
    <View>
      <Text style={{ fontSize: fontSizes.xxxl, padding: space.xl }}>
        My Header
      </Text>
    </View>
  );
};

export const AuthFooter = () => {
  const {
    tokens: { space, fontSizes },
  } = useTheme();
  return (
    <Text style={{ fontSize: fontSizes.xxxl, padding: space.xl }}>
      My footer
    </Text>
  );
};
