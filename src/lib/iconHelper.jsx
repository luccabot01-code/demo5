import { 
  Home, Plane, Shield, Heart, Car, Baby, BookOpen, DollarSign, 
  GraduationCap, Palmtree, Laptop, Gift, Gem, Building, Target,
  Activity, Film, Dumbbell, Coffee, Moon, Users, Gamepad, Music, 
  Sun, Utensils, Sparkles, Star, Smile, Cake, User, UserCircle,
  ShoppingBag, Circle
} from 'lucide-react'

// Icon mapping for goals
export const getGoalIcon = (iconName) => {
  const icons = {
    Home, Plane, Shield, Heart, Car, Baby, BookOpen, DollarSign,
    GraduationCap, Palmtree, Laptop, Gift, Gem, Building, Target
  }
  const IconComponent = icons[iconName] || Target
  return IconComponent
}

// Icon mapping for habits
export const getHabitIcon = (iconName) => {
  const icons = {
    Activity, Film, BookOpen, Heart, Dumbbell, Coffee, Moon, 
    Users, Gamepad, Music, Sun, Utensils
  }
  const IconComponent = icons[iconName] || Activity
  return IconComponent
}

// Icon mapping for memories
export const getMoodIcon = (iconName) => {
  const icons = {
    Heart, Sparkles, Star, Smile, Sun, Moon, Coffee, Music, 
    Gift, Cake, Plane, Home
  }
  const IconComponent = icons[iconName] || Heart
  return IconComponent
}

// Icon mapping for avatars
export const getAvatarIcon = (iconName) => {
  const icons = {
    User, UserCircle, Users, Heart, Smile, Star
  }
  const IconComponent = icons[iconName] || User
  return IconComponent
}

// Icon mapping for categories (tasks, etc)
export const getCategoryIcon = (iconName) => {
  const icons = {
    Heart, Home, Plane, ShoppingBag, Activity, Circle
  }
  const IconComponent = icons[iconName] || Heart
  return IconComponent
}
