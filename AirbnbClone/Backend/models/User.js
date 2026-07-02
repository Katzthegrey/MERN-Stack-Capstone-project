import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    role: { 
        type: String, 
        enum: ['user', 'host'], 
        default: 'user' 
    },
    
    // Profile
    avatar: { 
        type: String, 
        default: '' 
    },
    phone: { 
        type: String, 
        default: '' 
    },
    
    // Host-specific
    isHostVerified: { 
        type: Boolean, 
        default: false 
    },
    listings: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'accommodation' 
    }],
    
    // User activity
    wishlists: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'accommodation' 
    }],
    bookings: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'booking' 
    }],
    
    // Account status
    isActive: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

// Indexes
userSchema.index({ role: 1 });

// Virtuals
userSchema.virtual('isHost').get(function() {
    return this.role === 'host';
});

// Methods
userSchema.methods.getPublicProfile = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.isActive;
    return userObject;
};

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;