import BackgroundChannel from "./background";
import ContentChannel from "./content";
import IncludeChannel from "./include";
import ChannelHandler from "./handler";
import Deferred, { promisify } from './deferred'

Deferred.promisify = promisify;

export { BackgroundChannel, ContentChannel, IncludeChannel, ChannelHandler, Deferred };
