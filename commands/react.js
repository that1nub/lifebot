new Command({
  title: "React",
  shortDesc: "Set up roles for a react group, set up message to react to for roles.",
  longDesc: "Set up roles for a react group. Set up a message for people to react to for roles.\nUSAGE:\n[group control]: create, delete, add, remove, message\n[group name]: Identifier for your desired group\n{value}: Either a role, or the group identifier (no spaces for group identifier). If creating or deleting a group, put this in the [group name]",
  call: "react",
  usage: "[group control] [group name] {value}",
  example: "~react create Verify\n~react add Verify Verified",
  function: function(message, args){
    
  }
}).register();
