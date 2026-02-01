# Portfolio to Cafe Website Transformation Plan

## Overview
Transforming Mishwa's video portfolio into "Cafe De Meet" - an aesthetic cafe website

## Changes Required

### 1. Branding
- [x] Name: MISHWA → Cafe De Meet
- [x] Color scheme: Tech blue/cyan → Warm cafe tones (browns, creams, coffee colors)
- [x] Imagery: Video thumbnails → Food & cafe images

### 2. Frontend Components

#### Hero Section
- [x] Title: "Cafe De Meet"
- [x] Subtitle: "FRESHLY BREWED EXPERIENCES"
- [x] Description: Cafe-themed tagline
- [x] Button: "View Portfolio" → "Explore Menu"

#### Work → Menu Section
- [x] Title: "Latest Reels" → "Featured Dishes"
- [x] Show 4 featured menu items
- [x] Button: "View All Archives" → "View Full Menu"
- [x] Each item: Video project → Food dish
- [x] Categories: Video categories → Food categories

#### Cinema → Specialties Section
- [x] Title: "Long Form Works" → "Our Specialties"
- [x] Showcase: 2 signature items or cafe ambiance

#### About → Contact & Location Section
- [x] Replace bio with:
  - Contact details (phone, email)
  - Opening hours
  - Location address
  - Embedded Google Map
- [x] Remove metrics, keep cafe ambiance image

#### Reviews Section
- [x] Update: "Client Love" → "What Our Guests Say"
- [x] Keep structure, update review content to cafe-themed

#### Navbar
- [x] Links: Work → Menu, Cinema → Specials, About → Location
- [x] Add Zomato icon

#### Footer
- [x] Add Zomato social link

### 3. AllReels → Menu Page
- [x] Title: "Archives" → "Our Menu"
- [x] Categories: Video categories → Food categories
- [x] Items: Projects → Menu items with prices

### 4. Admin Panel
- [x] "Projects" → "Menu Items"
- [x] Add featured item selector (4 items for homepage)
- [x] Add contact/location editor
- [x] Add redirect type (Zomato/Call option)
- [x] Update category options

### 5. Database Structure
- [x] Update content schema
- [x] Add cafe-specific fields
- [x] Pre-populate with sample cafe data

### 6. Styling Enhancements
- [x] Update color palette in tailwind.config.js
- [x] Add more animations
- [x] Enhanced hover effects
- [x] Cafe-themed backgrounds

## Food Categories
- Hot Beverages
- Cold Beverages
- Breakfast
- Main Course
- Desserts
- Snacks & Appetizers

## Implementation Order
1. Update tailwind colors
2. Update database structure
3. Update all components
4. Update admin panel
5. Add Google Maps embed
6. Test all functionality
